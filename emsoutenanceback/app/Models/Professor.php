<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Professor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'specialite',
        'phone',
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relation avec les étudiants encadrés
     */
    public function studentsEncadres(): HasMany
    {
        return $this->hasMany(Student::class, 'encadrant_id');
    }

    /**
     * Relation avec les étudiants rapportés
     */
    public function studentsRapportes(): HasMany
    {
        return $this->hasMany(Student::class, 'rapporteur_id');
    }

    /**
     * Relation avec les remarques
     */
    public function remarks(): HasMany
    {
        return $this->hasMany(Remark::class);
    }

    /**
     * Relation avec les jurys de soutenance
     */
    public function juryDefenses(): HasMany
    {
        return $this->hasMany(JuryDefense::class);
    }
}

