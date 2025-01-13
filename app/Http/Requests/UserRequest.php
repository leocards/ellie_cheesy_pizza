<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
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
            "first_name" => ["required", "string"],
            "last_name" => ["required", "string"],
            "middle_name" => ["nullable", "string"],
            "birthdate" => ["required", "date"],
            "sex" => ["required", "in:male,female"],
            "address" => ["required", "string"],
            "mobile" => ["nullable", "size:11"],
            "email" => ["required", "email", Rule::unique('users')->ignore($this->route('user'))],
            "role" => ["required", "in:admin,staff"],
            "username" => ["required", "min:8", Rule::unique('users')->ignore($this->route('user'))],
            "password" => ["required", "min:8"],
            "avatar" => ["nullable", "mimes:png,jpg,jpeg", "max:".(10 * 1024)],
        ];
    }
}
