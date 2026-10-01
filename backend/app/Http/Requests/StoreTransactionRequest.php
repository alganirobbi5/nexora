<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'category_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->where(function ($query) {
                    $query->where('user_id', auth()->id())
                          ->orWhere('user_id', null);
                }),
            ],
            'type' => 'required|in:income,expense',
            'amount' => 'required|integer|min:1',
            'description' => 'nullable|string|max:255',
            'transaction_date' => 'required|date',
        ];
    }
}