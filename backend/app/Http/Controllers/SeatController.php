<?php

namespace App\Http\Controllers;

use App\Models\Seat;
use App\Models\Booking;
use Illuminate\Http\Request;

class SeatController extends Controller
{
    public function getSeatsForScreening($screeningId)
    {
        // Get all seats for the theatre
        $seats = Seat::where('theatre_id', function($query) use ($screeningId) {
            $query->select('theatre_id')
                  ->from('screenings')
                  ->where('id', $screeningId);
        })->get();

        // Get booked seats for this screening
        $bookedSeats = Booking::where('screening_id', $screeningId)
                             ->pluck('seat_id')
                             ->toArray();

        // Mark seats as booked or available
        $seats = $seats->map(function($seat) use ($bookedSeats) {
            $seat->status = in_array($seat->id, $bookedSeats) ? 'booked' : 'available';
            return $seat;
        });

        return response()->json($seats);
    }

    public function bookSeat(Request $request)
    {
        $request->validate([
            'seat_id' => 'required|exists:seats,id',
            'screening_id' => 'required|exists:screenings,id',
        ]);

        // Add booking logic here
    }
}
