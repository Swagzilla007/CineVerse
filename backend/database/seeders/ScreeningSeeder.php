<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Screening;
use App\Models\Movie;
use Carbon\Carbon;

class ScreeningSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Clear existing screenings
        Screening::truncate();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $movies = Movie::all();
        $theatreIds = [1, 2, 3]; // Assuming you have these theatre IDs
        $times = ['10:00', '13:00', '16:00', '19:00', '21:30'];

        foreach ($movies as $movie) {
            // Create screenings for next 7 days
            for ($day = 0; $day < 7; $day++) {
                foreach ($times as $time) {
                    $startTime = Carbon::today()->addDays($day)->setTimeFromTimeString($time);
                    
                    // Calculate end time based on movie duration
                    $duration = (int) filter_var($movie->duration, FILTER_SANITIZE_NUMBER_INT);
                    $endTime = $startTime->copy()->addMinutes($duration);
                    
                    Screening::create([
                        'movie_id' => $movie->id,
                        'theatre_id' => $theatreIds[array_rand($theatreIds)], // Random theatre
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'price' => rand(80000, 150000), // Price in VND (80,000 - 150,000)
                        'is_active' => true
                    ]);
                }
            }
        }
    }
}
