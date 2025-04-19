<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Seat;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function show($screeningId)
    {
        // Get all seats for the screening's theatre
        $seats = Seat::with(['bookings' => function($query) use ($screeningId) {
            $query->where('screening_id', $screeningId);
        }])->get()->map(function($seat) {
            return [
                'id' => $seat->id,
                'row' => $seat->row,
                'number' => $seat->number,
                'status' => $seat->bookings->count() > 0 ? 'booked' : 'available'
            ];
        });

        return response()->json($seats);
    }

    public function store(Request $request)
    {
        $request->validate([
            'screening_id' => 'required|exists:screenings,id',
            'seat_id' => 'required|exists:seats,id',
        ]);

        // Check if seat is already booked
        $isBooked = Booking::where('screening_id', $request->screening_id)
                          ->where('seat_id', $request->seat_id)
                          ->exists();

        if ($isBooked) {
            return response()->json([
                'message' => 'Seat is already booked'
            ], 422);
        }

        $booking = Booking::create([
            'user_id' => auth()->id(),
            'screening_id' => $request->screening_id,
            'seat_id' => $request->seat_id,
            'total_amount' => $request->total_amount,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Booking successful',
            'booking' => $booking
        ], 201);
    }
}
