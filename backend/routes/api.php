<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\MovieController;
use App\Http\Controllers\API\TheatreController;
use App\Http\Controllers\API\ScreeningController;
use App\Http\Controllers\API\SeatController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\AdminBookingController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Movie Routes
Route::get('/movies/public', [MovieController::class, 'publicIndex']);
Route::get('/movies/public/{movie}', [MovieController::class, 'publicShow']);
Route::get('/screenings/public', [ScreeningController::class, 'publicIndex']);
Route::get('/screenings/public/{screening}', [ScreeningController::class, 'publicShow']); // Added public endpoint for single screening
Route::get('/screenings/public/{screening}/available-seats', [ScreeningController::class, 'publicAvailableSeats']); // Added public endpoint for available seats
Route::get('/theatres/public', [TheatreController::class, 'publicIndex']); // Added public endpoint for theatres

// Public movie routes
Route::get('/movies/public', [MovieController::class, 'index']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // User Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/user/bookings', [BookingController::class, 'getUserBookings']);
    
    // Booking Routes
    Route::apiResource('bookings', BookingController::class);
    Route::get('/screenings/{screening}/available-seats', [ScreeningController::class, 'getAvailableSeats']);

    // Protected movie routes
    Route::post('/movies', [MovieController::class, 'store']);
    Route::put('/movies/{id}', [MovieController::class, 'update']);
    Route::delete('/movies/{id}', [MovieController::class, 'destroy']);

    // Protected screening routes
    Route::post('/screenings', [ScreeningController::class, 'store']);
    Route::get('/screenings', [ScreeningController::class, 'index']);
    Route::get('/screenings/{screening}', [ScreeningController::class, 'show']);
    Route::get('screenings/{screening}/seats', [SeatController::class, 'getSeatsForScreening']);

    // Admin Routes
    Route::middleware('admin')->group(function () {
        Route::apiResource('movies', MovieController::class)->except(['index', 'show']);
        Route::apiResource('theatres', TheatreController::class);
        Route::apiResource('screenings', ScreeningController::class)->except(['index', 'show']);
        Route::apiResource('seats', SeatController::class);
        Route::post('seats/bulk-create', [SeatController::class, 'bulkCreate']);
    });

    Route::get('/screenings/{screening}/seats', [SeatController::class, 'getAvailableSeats']);
    Route::post('/seats/book', [SeatController::class, 'bookSeat']);
});

// Admin Routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::put('/bookings/{booking}', [BookingController::class, 'update']);
    Route::get('/admin/bookings', [BookingController::class, 'adminIndex']);
    Route::get('/admin/bookings', [BookingController::class, 'getAllBookings']);
    Route::put('/admin/bookings/{booking}', [BookingController::class, 'updateStatus']);
    Route::get('/bookings/all', [BookingController::class, 'getAllBookings']);
    Route::put('/bookings/{booking}/status', [BookingController::class, 'updateBookingStatus']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/bookings', [AdminBookingController::class, 'index']);
    Route::put('/admin/bookings/{id}/status', [AdminBookingController::class, 'updateStatus']);
});