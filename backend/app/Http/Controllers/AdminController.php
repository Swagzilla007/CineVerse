<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Movie;
use App\Models\User;
use App\Models\Screening;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function getDashboardStats()
    {
        try {
            $totalUsers = User::count();
            $totalMovies = Movie::count();
            $totalBookings = Booking::count();
            $totalRevenue = Booking::sum('total_amount');

            // Get today's screenings
            $todayScreenings = Screening::whereDate('screening_time', Carbon::today())->count();

            // Get recent bookings
            $recentBookings = Booking::with(['user', 'screening.movie'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'totalUsers' => $totalUsers,
                    'totalMovies' => $totalMovies,
                    'totalBookings' => $totalBookings,
                    'totalRevenue' => $totalRevenue,
                    'todayScreenings' => $todayScreenings,
                    'recentBookings' => $recentBookings
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
