<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryBudget extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'year',
        'month',
        'limit_amount',
    ];

    protected $casts = [
        'year' => 'integer',
        'month' => 'integer',
        'limit_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}