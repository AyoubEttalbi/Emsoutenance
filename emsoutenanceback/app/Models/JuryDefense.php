<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JuryDefense extends Model
{
    use HasFactory;

    protected $table = 'jury_defense';

    protected $fillable = [
        'defense_id',
        'professor_id',
        'role',
    ];

    /**
     * Relation avec la soutenance
     */
    public function defense(): BelongsTo
    {
        return $this->belongsTo(Defense::class);
    }

    /**
     * Relation avec le professeur
     */
    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }
}

