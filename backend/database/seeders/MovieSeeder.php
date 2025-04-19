<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Movie;
use App\Models\Screening;
use Illuminate\Support\Facades\DB;

class MovieSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Clear existing screenings and movies
        Screening::truncate();
        Movie::truncate();
        
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $movies = [
            [
                'title' => 'Avengers: Endgame',
                'description' => 'After Thanos wiped out half of all life in the universe, the remaining Avengers must do what\'s necessary to undo the Mad Titan\'s deed.',
                'duration' => '3h 1min',
                'genre' => 'Action, Adventure, Drama',
                'release_date' => '2019-04-26',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
                'trailer_url' => 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
                'is_active' => true
            ],
            [
                'title' => 'The Prestige',
                'description' => 'Two stage magicians engage in competitive one-upmanship in an attempt to create the ultimate stage illusion.',
                'duration' => '2h 10min',
                'genre' => 'Drama, Mystery, Thriller',
                'release_date' => '2006-10-20',
                'poster_url' => 'https://i.pinimg.com/originals/99/6d/35/996d3573fe068216220edc93f2106c39.jpg',
                'trailer_url' => 'https://www.youtube.com/watch?v=o4gHCmTQDVI',
                'is_active' => true
            ],
            [
                'title' => 'The Dark Knight Rises',
                'description' => 'Eight years after the Joker\'s reign of anarchy, Batman must return to defend Gotham City against the enigmatic jewel thief Catwoman and the ruthless mercenary Bane.',
                'duration' => '2h 44min',
                'genre' => 'Action, Drama, Thriller',
                'release_date' => '2012-07-20',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/85cWkCVftiVs0BVey6pxX8uNmLt.jpg',
                'trailer_url' => 'https://www.youtube.com/watch?v=GokKUqLcvD8',
                'is_active' => true
            ],
            [
                'title' => 'Interstellar',
                'description' => 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                'duration' => '2h 49min',
                'genre' => 'Adventure, Drama, Sci-Fi',
                'release_date' => '2014-11-07',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
                'trailer_url' => 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
                'is_active' => true
            ],
        ];

        foreach ($movies as $movie) {
            Movie::create($movie);
        }
    }
}
