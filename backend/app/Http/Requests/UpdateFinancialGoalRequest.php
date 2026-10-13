<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFinancialGoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:150'],
            'target_amount' => ['sometimes', 'required', 'integer', 'min:1'],
            'current_amount' => ['sometimes', 'integer', 'min:0'],
            'deadline' => ['nullable', 'date'],
            'status' => ['sometimes', 'in:active,completed,archived'],
        ];
    }
}
