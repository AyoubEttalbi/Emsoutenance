<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReportUploadRequest extends FormRequest
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
            'report' => 'required|file|mimes:pdf,docx|max:20480', // Max 20MB
            'version' => 'required|in:initial,corrige',
        ];
    }
}
