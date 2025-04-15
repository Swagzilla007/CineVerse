<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Theatre extends Model
{
    protected $fillable = [
        'name',
        'capacity',
        'screen_type',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'capacity' => 'integer'
    ];

    public function screenings(): HasMany
    {
        return $this->hasMany(Screening::class);
    }

    public function seats(): HasMany
    {
        return $this->hasMany(Seat::class);
    }
}
