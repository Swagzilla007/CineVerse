<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user', 'screening.movie', 'screening.theatre'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $booking = Booking::findOrFail($id);
        $booking->status = $request->status;
        $booking->save();

        return response()->json([
            'message' => 'Booking status updated successfully',
            'booking' => $booking
        ]);
    }
}
