<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFinancialGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'target_amount' => ['required', 'integer', 'min:1'],
            'opening_amount' => ['nullable', 'integer', 'min:0'],
            'current_amount' => ['nullable', 'integer', 'min:0'],
            'deadline' => ['nullable', 'date'],
            'status' => ['nullable', 'in:active,completed,archived'],
        ];
    }
}
