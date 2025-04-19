<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seat extends Model
{
    use HasFactory;

    protected $fillable = [
        'theatre_id',
        'row',
        'number',
        'status'
    ];

    protected $casts = [
        'number' => 'integer'
    ];

    public function theatre(): BelongsTo
    {
        return $this->belongsTo(Theatre::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
