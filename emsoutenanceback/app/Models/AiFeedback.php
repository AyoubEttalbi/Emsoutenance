<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiFeedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'grammar_issues_count',
        'grammar_samples',
        'ai_feedback',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }
}
