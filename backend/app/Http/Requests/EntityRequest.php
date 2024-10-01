<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EntityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    // this should check if user is allowed to perform any action with API
    public function authorize()
    {
        return True;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => ['required', 'string','max:255'],
            'date' => ['required', 'string','max:255'],
            'condition' => ['required', 'integer','max:10'],
            'deletable' => ['required', 'boolean'],
        ];
    }
}
