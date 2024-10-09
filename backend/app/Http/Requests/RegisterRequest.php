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
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => [
                'required',
                RulesPassword::min(8) ->letters()
            ]
        ];
    }
}
