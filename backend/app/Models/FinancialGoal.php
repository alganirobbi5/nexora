<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class FinancialGoal extends Model
{
    protected function casts(): array
    {
        return [
            'target_amount' => 'integer',
            'current_amount' => 'integer',
            'opening_amount' => 'integer',
            'deadline' => 'date',
        ];
    }

    protected $fillable = [
        'user_id',
        'title',
        'target_amount',
        'current_amount',
        'opening_amount',
        'deadline',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contributions(): HasMany
    {
        return $this->hasMany(FinancialGoalContribution::class);
    }

    public function getContributionsTotalAttribute(): int
    {
        if (array_key_exists('contributions_sum_amount', $this->attributes)) {
            return (int) ($this->attributes['contributions_sum_amount'] ?? 0);
        }

        if ($this->relationLoaded('contributions')) {
            return (int) $this->contributions->sum('amount');
        }

        return (int) $this->contributions()->sum('amount');
    }

    public function getCollectedAmountAttribute(): int
    {
        return (int) $this->opening_amount + $this->contributions_total;
    }

    public function getRemainingAmountAttribute(): int
    {
        return max((int) $this->target_amount - $this->collected_amount, 0);
    }

    public function getProgressPercentageAttribute(): float|int
    {
        $target = (int) $this->target_amount;

        if ($target <= 0) {
            return 0;
        }

        return $this->collected_amount / $target * 100;
    }

    /**
     * Consistent API representation with derived goal values.
     *
     * current_amount is kept as a backward-compatible display alias for the
     * derived collected amount; it is no longer an independent running total.
     */
    public function toApiArray(): array
    {
        $data = $this->toArray();

        unset($data['contributions_sum_amount']);

        $data['opening_amount'] = (int) $this->opening_amount;
        $data['contributions_total'] = $this->contributions_total;
        $data['collected_amount'] = $this->collected_amount;
        $data['remaining_amount'] = $this->remaining_amount;
        $data['progress_percentage'] = $this->progress_percentage;
        $data['current_amount'] = $this->collected_amount;

        return $data;
    }
}
