<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'file_path',
        'original_filename',
        'version',
        'status',
        'submitted_at',
        'validated_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'validated_at' => 'datetime',
        ];
    }

    /**
     * Relation avec l'étudiant
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Relation avec les remarques
     */
    public function remarks(): HasMany
    {
        return $this->hasMany(Remark::class);
    }

    /**
     * Relation avec les soutenances
     */
    public function defenses(): HasMany
    {
        return $this->hasMany(Defense::class);
    }

    /**
     * Relation avec le feedback IA (one-to-one)
     */
    public function aiFeedback()
    {
        return $this->hasOne(AiFeedback::class);
    }
}

