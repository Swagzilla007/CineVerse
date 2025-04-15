<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Theatre;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TheatreController extends Controller
{
    public function index(): JsonResponse
    {
        $theatres = Theatre::with(['seats', 'screenings'])->where('is_active', true)->get();
        return response()->json($theatres);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'screen_type' => 'required|string|max:50',
            'is_active' => 'boolean'
        ]);

        $theatre = Theatre::create($validated);
        return response()->json($theatre, 201);
    }

    public function show(Theatre $theatre): JsonResponse
    {
        return response()->json($theatre->load(['seats', 'screenings']));
    }

    public function update(Request $request, Theatre $theatre): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'capacity' => 'integer|min:1',
            'screen_type' => 'string|max:50',
            'is_active' => 'boolean'
        ]);

        $theatre->update($validated);
        return response()->json($theatre);
    }

    public function destroy(Theatre $theatre): JsonResponse
    {
        $theatre->delete();
        return response()->json(null, 204);
    }
}
