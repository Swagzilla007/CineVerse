use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\MovieController;
use App\Http\Controllers\API\TheatreController;
use App\Http\Controllers\API\ScreeningController;
use App\Http\Controllers\API\SeatController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\DashboardController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Movie Routes
Route::get('/movies/public', [MovieController::class, 'publicIndex']);
Route::get('/movies/public/{id}', [MovieController::class, 'publicShow']);
Route::get('/screenings/public', [ScreeningController::class, 'publicIndex']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // User Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/user/bookings', [BookingController::class, 'getUserBookings']);
    
    // Booking Routes
    Route::apiResource('bookings', BookingController::class);
    Route::get('/screenings/{screening}/available-seats', [ScreeningController::class, 'getAvailableSeats']);

    // Admin Routes
    Route::middleware('admin')->group(function () {
        Route::apiResource('movies', MovieController::class)->except(['index', 'show']);
        Route::apiResource('theatres', TheatreController::class);
        Route::apiResource('screenings', ScreeningController::class)->except(['index', 'show']);
        Route::apiResource('seats', SeatController::class);
        Route::post('seats/bulk-create', [SeatController::class, 'bulkCreate']);
        
        // Dashboard Stats
        Route::get('/stats/dashboard', [DashboardController::class, 'getStats']);
    });
});