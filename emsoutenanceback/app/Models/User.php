<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'type',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relation avec le profil étudiant
     */
    public function student()
    {
        return $this->hasOne(Student::class);
    }

    /**
     * Relation avec le profil professeur
     */
    public function professor()
    {
        return $this->hasOne(Professor::class);
    }

    /**
     * Vérifier si l'utilisateur est un administrateur
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Vérifier si l'utilisateur est un étudiant
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    /**
     * Vérifier si l'utilisateur est un professeur
     */
    public function isProfessor(): bool
    {
        return $this->role === 'professor';
    }
}
