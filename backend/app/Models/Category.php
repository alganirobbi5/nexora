<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected function casts(): array
    {
        return [
            'type' => 'string',
        ];
    }

    protected $fillable = [
        'user_id',
        'name',
        'type',
        'icon',
        'color',
    ];

    public function user(): HasMany
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}