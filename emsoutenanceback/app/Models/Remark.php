<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Remark extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_id',
        'professor_id',
        'content',
    ];

    /**
     * Relation avec le rapport
     */
    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    /**
     * Relation avec le professeur
     */
    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }
}

