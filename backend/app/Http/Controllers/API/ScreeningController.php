<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Screening;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class ScreeningController extends Controller
{
    public function index(): JsonResponse
    {
        $screenings = Screening::with(['movie', 'theatre'])
            ->where('end_time', '>=', now())
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get();
        return response()->json($screenings);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'movie_id' => 'required|exists:movies,id',
            'theatre_id' => 'required|exists:theatres,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean'
        ]);

        // Check for scheduling conflicts
        $conflicts = Screening::where('theatre_id', $validated['theatre_id'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']]);
            })->exists();

        if ($conflicts) {
            return response()->json(['message' => 'Time slot is not available'], 422);
        }

        $screening = Screening::create($validated);
        return response()->json($screening->load(['movie', 'theatre']), 201);
    }

    public function show(Screening $screening): JsonResponse
    {
        return response()->json($screening->load(['movie', 'theatre', 'bookings']));
    }

    public function update(Request $request, Screening $screening): JsonResponse
    {
        $validated = $request->validate([
            'movie_id' => 'exists:movies,id',
            'theatre_id' => 'exists:theatres,id',
            'start_time' => 'date|after:now',
            'end_time' => 'date|after:start_time',
            'price' => 'numeric|min:0',
            'is_active' => 'boolean'
        ]);

        if (isset($validated['start_time']) || isset($validated['end_time']) || isset($validated['theatre_id'])) {
            $checkStart = $validated['start_time'] ?? $screening->start_time;
            $checkEnd = $validated['end_time'] ?? $screening->end_time;
            $checkTheatre = $validated['theatre_id'] ?? $screening->theatre_id;

            $conflicts = Screening::where('theatre_id', $checkTheatre)
                ->where('id', '!=', $screening->id)
                ->where(function ($query) use ($checkStart, $checkEnd) {
                    $query->whereBetween('start_time', [$checkStart, $checkEnd])
                        ->orWhereBetween('end_time', [$checkStart, $checkEnd]);
                })->exists();

            if ($conflicts) {
                return response()->json(['message' => 'Time slot is not available'], 422);
            }
        }

        $screening->update($validated);
        return response()->json($screening->load(['movie', 'theatre']));
    }

    public function destroy(Screening $screening): JsonResponse
    {
        if ($screening->bookings()->exists()) {
            return response()->json(['message' => 'Cannot delete screening with existing bookings'], 422);
        }
        
        $screening->delete();
        return response()->json(null, 204);
    }

    public function getAvailableSeats(Screening $screening): JsonResponse
    {
        $bookedSeatIds = $screening->bookings()
            ->where('status', '!=', 'cancelled')
            ->pluck('seat_id');

        $availableSeats = $screening->theatre->seats()
            ->whereNotIn('id', $bookedSeatIds)
            ->where('status', 'available')
            ->get();

        return response()->json($availableSeats);
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $query = Screening::with(['movie', 'theatre'])
            ->where('start_time', '>=', now())
            ->where('is_active', true);
            
        if ($request->has('movie_id')) {
            $query->where('movie_id', $request->movie_id);
        }
        
        return response()->json($query->orderBy('start_time')->get());
    }
}
