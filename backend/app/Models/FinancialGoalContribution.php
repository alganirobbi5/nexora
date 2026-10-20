<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class FinancialGoalContribution extends Model
{
    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'contribution_date' => 'date',
        ];
    }

    protected $fillable = [
        'financial_goal_id',
        'amount',
        'contribution_date',
        'note',
    ];

    public function financialGoal(): BelongsTo
    {
        return $this->belongsTo(FinancialGoal::class);
    }
}
