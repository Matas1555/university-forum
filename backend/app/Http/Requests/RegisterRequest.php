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
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/'
            ],
            'password_confirmation' => 'required|same:password',
            'university' => 'nullable|integer|exists:universities,id',
            'status_id' => 'nullable|integer|exists:statuses,id',
            'yearOfGraduation' => 'nullable|integer',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'bio' => 'nullable|string',
            'fullName' => 'nullable|string|max:255',
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
