<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password as RulesPassword;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|unique:users,email',
            'password' => [
                'required',
                RulesPassword::min(8) ->letters()->numbers()
            ],
            'university' => 'nullable|integer|exists:universities,id',
            'yearOfGraduation' => 'nullable|integer',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'bio' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'username.unique' => 'The username has already been taken.',
            'email.unique' => 'The email has already been registered.',
        ];
    }
}
