<?php

namespace Database\Seeders;

use App\Models\Seat;
use App\Models\Theatre;
use Illuminate\Database\Seeder;

class SeatSeeder extends Seeder
{
    public function run()
    {
        $theatres = Theatre::all();

        foreach ($theatres as $theatre) {
            // Create 10 rows (A-J)
            for ($row = 'A'; $row <= 'J'; $row++) {
                // Create 10 seats per row (1-10)
                for ($number = 1; $number <= 10; $number++) {
                    Seat::create([
                        'theatre_id' => $theatre->id,
                        'row' => $row,
                        'number' => $number,
                        'status' => 'available'
                    ]);
                }
            }
        }
    }
}
