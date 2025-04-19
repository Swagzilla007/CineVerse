<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Seat;
use App\Models\Screening;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $bookings = Booking::query()
            ->with(['screening.movie', 'screening.theatre', 'seat', 'user']);

        if ($request->user() && !$request->user()->is_admin) {
            $bookings->where('user_id', $request->user()->id);
        }

        return response()->json($bookings->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'screening_id' => 'required|exists:screenings,id',
            'seat_id' => 'required|exists:seats,id',
        ]);

        try {
            DB::beginTransaction();

            $screening = Screening::findOrFail($validated['screening_id']);
            $seat = Seat::findOrFail($validated['seat_id']);

            // Check if screening is in the future
            if ($screening->start_time <= now()) {
                throw new \Exception('Cannot book tickets for past screenings');
            }

            // Check if seat is available
            $isBooked = Booking::where('screening_id', $screening->id)
                ->where('seat_id', $seat->id)
                ->where('status', '!=', 'cancelled')
                ->exists();

            if ($isBooked) {
                throw new \Exception('Seat is already booked');
            }

            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'screening_id' => $screening->id,
                'seat_id' => $seat->id,
                'booking_number' => 'BK-' . Str::random(8),
                'total_amount' => $screening->price,
                'status' => 'pending',
                'booked_at' => now(),
            ]);

            // Update seat status
            $seat->update(['status' => 'booked']);

            DB::commit();
            return response()->json($booking->load(['screening.movie', 'screening.theatre', 'seat']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Booking $booking): JsonResponse
    {
        // Check if user has permission to view this booking
        if (!$booking->user_id === auth()->id() && !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($booking->load(['screening.movie', 'screening.theatre', 'seat', 'user']));
    }

    public function update(Request $request, Booking $booking): JsonResponse
    {
        if (!$booking->user_id === auth()->id() && !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:confirmed,cancelled'
        ]);

        try {
            DB::beginTransaction();

            $booking->update($validated);

            // Update seat status based on booking status
            $booking->seat->update([
                'status' => $validated['status'] === 'cancelled' ? 'available' : 'booked'
            ]);

            DB::commit();
            return response()->json($booking->load(['screening.movie', 'screening.theatre', 'seat']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function destroy(Booking $booking): JsonResponse
    {
        if (!auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            DB::beginTransaction();

            // Update seat status to available
            $booking->seat->update(['status' => 'available']);
            $booking->delete();

            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function getUserBookings(): JsonResponse
    {
        $bookings = Booking::where('user_id', auth()->id())
            ->with(['screening.movie', 'screening.theatre', 'seat'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    public function adminIndex(): JsonResponse
    {
        $bookings = Booking::with(['user', 'screening.movie', 'screening.theatre', 'seat'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    public function getAllBookings(): JsonResponse
    {
        $bookings = Booking::with(['user', 'screening.movie', 'screening.theatre', 'seat'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $booking->update($validated);
        
        return response()->json($booking->load(['screening.movie', 'screening.theatre', 'seat']));
    }
}
