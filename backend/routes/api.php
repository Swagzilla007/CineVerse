use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\MovieController;
use App\Http\Controllers\API\TheatreController;
use App\Http\Controllers\API\ScreeningController;
use App\Http\Controllers\API\SeatController;
use App\Http\Controllers\API\BookingController;

Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Movie routes
    Route::apiResource('movies', MovieController::class);
    
    // Theatre routes
    Route::apiResource('theatres', TheatreController::class);
    
    // Screening routes
    Route::apiResource('screenings', ScreeningController::class);
    Route::get('screenings/{screening}/available-seats', [ScreeningController::class, 'getAvailableSeats']);
    
    // Seat routes
    Route::apiResource('seats', SeatController::class);
    Route::post('seats/bulk-create', [SeatController::class, 'bulkCreate']);
    
    // Booking routes
    Route::apiResource('bookings', BookingController::class);
    Route::get('user/bookings', [BookingController::class, 'getUserBookings']);
});

// Public routes
Route::get('movies/public', [MovieController::class, 'index']);
Route::get('screenings/public', [ScreeningController::class, 'index']);