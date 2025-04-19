<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Theatre;

class TheatreSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Theatre::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $theatres = [
            [
                'name' => 'Theatre 1', 
                'capacity' => 100,
                'screen_type' => 'Standard',
                'is_active' => true,
                'price' => 800, // LKR
                'currency' => 'LKR'
            ],
            [
                'name' => 'Theatre 2', 
                'capacity' => 150,
                'screen_type' => 'IMAX',
                'is_active' => true,
                'price' => 1500, // LKR
                'currency' => 'LKR'
            ],
            [
                'name' => 'Theatre 3', 
                'capacity' => 200,
                'screen_type' => '3D',
                'is_active' => true,
                'price' => 1200, // LKR
                'currency' => 'LKR'
            ],
            [
                'name' => '3D MAX',
                'screen_type' => '3D',
                'capacity' => 100,  // Added capacity
                'price' => 1500.00,
                'currency' => 'LKR'
            ],
            [
                'name' => '2D SILVER',
                'screen_type' => '2D',
                'capacity' => 150,  // Added capacity
                'price' => 1000.00,
                'currency' => 'LKR'
            ]
        ];

        foreach ($theatres as $theatre) {
            Theatre::create($theatre);
        }
    }
}
