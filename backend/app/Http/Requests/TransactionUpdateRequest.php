<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionUpdateRequest extends FormRequest
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
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0.01'],
            'transaction_date' => ['sometimes', 'required', 'date'],
            'type' => ['sometimes', 'required', 'in:income,expense'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'is_recurring' => ['sometimes', 'boolean'],
            'frequency' => ['required_if:is_recurring,true', 'in:daily,weekly,monthly,yearly'],
            'end_date' => ['nullable', 'date'],
        ];
    }
}
