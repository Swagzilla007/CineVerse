<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MovieController extends Controller
{
    public function index(): JsonResponse
    {
        $movies = Movie::with('screenings')->where('is_active', true)->get();
        return response()->json($movies);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'required|string',
            'genre' => 'required|string|max:100',
            'poster_url' => 'nullable|url',
            'trailer_url' => 'nullable|url',
            'release_date' => 'required|date',
            'is_active' => 'boolean'
        ]);

        $movie = Movie::create($validated);
        return response()->json($movie, 201);
    }

    public function show(Movie $movie): JsonResponse
    {
        return response()->json($movie->load('screenings'));
    }

    public function update(Request $request, Movie $movie): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'duration' => 'string',
            'genre' => 'string|max:100',
            'poster_url' => 'nullable|url',
            'trailer_url' => 'nullable|url',
            'release_date' => 'date',
            'is_active' => 'boolean'
        ]);

        $movie->update($validated);
        return response()->json($movie);
    }

    public function destroy(Movie $movie): JsonResponse
    {
        $movie->delete();
        return response()->json(null, 204);
    }
}
