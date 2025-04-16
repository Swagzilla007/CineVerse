<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Screening;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function getStats(): JsonResponse
    {
        $totalMovies = Movie::count();
        $activeScreenings = Screening::where('is_active', true)
            ->where('start_time', '>=', now())
            ->count();
        
        $totalBookings = Booking::count();
        
        $totalRevenue = Booking::where('status', 'confirmed')
            ->sum('total_amount');

        // Get recent bookings
        $recentBookings = Booking::with(['user', 'screening.movie', 'screening.theatre', 'seat'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get popular movies based on booking count
        $popularMovies = Movie::withCount(['screenings.bookings'])
            ->orderByDesc('screenings_bookings_count')
            ->take(5)
            ->get();

        return response()->json([
            'summary' => [
                'totalMovies' => $totalMovies,
                'activeScreenings' => $activeScreenings,
                'totalBookings' => $totalBookings,
                'totalRevenue' => $totalRevenue,
            ],
            'recentBookings' => $recentBookings,
            'popularMovies' => $popularMovies,
        ]);
    }
}
