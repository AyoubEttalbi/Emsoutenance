<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'matricule',
        'filiere',
        'stage_type',
        'phone',
        'encadrant_id',
        'rapporteur_id',
    ];

    protected function casts(): array
    {
        return [
            'stage_type' => 'string',
        ];
    }

    /**
     * Relation avec l'utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec l'encadrant
     */
    public function encadrant(): BelongsTo
    {
        return $this->belongsTo(Professor::class, 'encadrant_id');
    }

    /**
     * Relation avec le rapporteur
     */
    public function rapporteur(): BelongsTo
    {
        return $this->belongsTo(Professor::class, 'rapporteur_id');
    }

    /**
     * Relation avec les rapports
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    /**
     * Relation avec les soutenances
     */
    public function defenses(): HasMany
    {
        return $this->hasMany(Defense::class);
    }
}

