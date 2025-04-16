<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Theatre;
use App\Models\Movie;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@cineverse.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Create regular user
        User::create([
            'name' => 'Test User',
            'email' => 'user@cineverse.com',
            'password' => Hash::make('user123'),
            'role' => 'user',
        ]);

        // Create sample theatre
        Theatre::create([
            'name' => 'Main Theatre',
            'capacity' => 200,
            'screen_type' => 'IMAX',
            'is_active' => true,
        ]);

        // Create sample movie
        Movie::create([
            'title' => 'Sample Movie',
            'description' => 'A sample movie description',
            'duration' => '2h 30min',
            'genre' => 'Action',
            'release_date' => now(),
            'poster_url' => 'https://via.placeholder.com/300x450',
            'trailer_url' => 'https://www.youtube.com/watch?v=sample',
            'is_active' => true,
        ]);
    }
}
