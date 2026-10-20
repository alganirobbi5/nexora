<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $budget = $this->route('budget');

        return [
            'category_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:categories,id',
                Rule::unique('category_budgets', 'category_id')
                    ->ignore($budget)
                    ->where(fn ($query) => $query
                        ->where('user_id', $this->user()->id)
                        ->where('year', $this->input('year', $budget?->year))
                        ->where('month', $this->input('month', $budget?->month))),
            ],
            'year' => [
                'sometimes',
                'required',
                'integer',
                'min:1900',
                'max:2100',
            ],
            'month' => [
                'sometimes',
                'required',
                'integer',
                'between:1,12',
            ],
            'limit_amount' => [
                'sometimes',
                'required',
                'integer',
                'min:1',
            ],
            'category_type' => [
                'sometimes',
                'required',
                'string',
                'in:income,expense',
            ],
        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator)
    {
        $validator->after(function (\Illuminate\Validation\Validator $validator) {
            $categoryId = $this->input('category_id');

            if ($categoryId) {
                $category = \App\Models\Category::find($categoryId);
                if ($category && $category->user_id !== auth()->id()) {
                    $validator->errors()->add('category_id', 'The category does not belong to you.');
                }

                if ($category && $category->type !== 'expense') {
                    $validator->errors()->add('category_id', 'Budget can only be set for expense categories.');
                }
            }
        });
    }
}