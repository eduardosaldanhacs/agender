<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FinancialGoalUpdateRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:120'],
            'goal_type' => ['sometimes', 'required', Rule::in(['saving', 'expense_limit'])],
            'target_amount' => ['sometimes', 'required', 'numeric', 'min:0.01'],
            'current_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')->where(fn ($query) => $query->where('user_id', $this->user()->id)),
            ],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['sometimes', 'required', Rule::in(['active', 'completed', 'cancelled'])],
            'notes' => ['nullable', 'string', 'max:3000'],
        ];
    }
}
