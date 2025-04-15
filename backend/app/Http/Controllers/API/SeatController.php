<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Seat;
use App\Models\Theatre;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SeatController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $seats = Seat::query();
        
        if ($request->has('theatre_id')) {
            $seats->where('theatre_id', $request->theatre_id);
        }
        
        return response()->json($seats->with('theatre')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'theatre_id' => 'required|exists:theatres,id',
            'row' => 'required|string|max:10',
            'number' => 'required|integer|min:1',
            'status' => 'required|in:available,booked,maintenance',
            'type' => 'required|in:regular,premium,wheelchair'
        ]);

        // Check for duplicate seats
        $exists = Seat::where('theatre_id', $validated['theatre_id'])
            ->where('row', $validated['row'])
            ->where('number', $validated['number'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Seat already exists'], 422);
        }

        $seat = Seat::create($validated);
        return response()->json($seat, 201);
    }

    public function show(Seat $seat): JsonResponse
    {
        return response()->json($seat->load(['theatre', 'bookings']));
    }

    public function update(Request $request, Seat $seat): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'in:available,booked,maintenance',
            'type' => 'in:regular,premium,wheelchair'
        ]);

        $seat->update($validated);
        return response()->json($seat);
    }

    public function destroy(Seat $seat): JsonResponse
    {
        if ($seat->bookings()->exists()) {
            return response()->json(['message' => 'Cannot delete seat with existing bookings'], 422);
        }

        $seat->delete();
        return response()->json(null, 204);
    }

    public function bulkCreate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'theatre_id' => 'required|exists:theatres,id',
            'rows' => 'required|integer|min:1',
            'seats_per_row' => 'required|integer|min:1',
            'type' => 'required|in:regular,premium,wheelchair'
        ]);

        $theatre = Theatre::findOrFail($validated['theatre_id']);
        $seats = [];
        
        for ($row = 1; $row <= $validated['rows']; $row++) {
            $rowLetter = chr(64 + $row); // Convert number to letter (1=A, 2=B, etc.)
            
            for ($number = 1; $number <= $validated['seats_per_row']; $number++) {
                $seats[] = [
                    'theatre_id' => $theatre->id,
                    'row' => $rowLetter,
                    'number' => $number,
                    'status' => 'available',
                    'type' => $validated['type'],
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
        }

        Seat::insert($seats);
        return response()->json(['message' => 'Seats created successfully'], 201);
    }
}
