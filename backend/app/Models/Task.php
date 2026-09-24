<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
        ];
    }

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'priority',
        'due_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}