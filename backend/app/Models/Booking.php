<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'screening_id',
        'seat_id',
        'booking_number',
        'total_amount',
        'status'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'booked_at' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($booking) {
            $booking->booking_number = 'BK' . date('YmdHis') . rand(1000, 9999);
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function screening(): BelongsTo
    {
        return $this->belongsTo(Screening::class);
    }

    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }
}
