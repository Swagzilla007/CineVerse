<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Movie extends Model
{
    protected $fillable = [
        'title',
        'description',
        'duration',
        'genre',
        'poster_url',
        'trailer_url',
        'release_date',
        'is_active'
    ];

    protected $casts = [
        'release_date' => 'date',
        'is_active' => 'boolean'
    ];

    public function screenings(): HasMany
    {
        return $this->hasMany(Screening::class);
    }
}
