<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFinancialGoalContributionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount' => ['sometimes', 'required', 'integer', 'min:1'],
            'contribution_date' => ['sometimes', 'required', 'date'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
