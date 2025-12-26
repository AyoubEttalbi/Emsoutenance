<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Professor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login utilisateur
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->load(['student', 'professor']);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Inscription (pour les étudiants uniquement)
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'matricule' => 'required|string|unique:students',
            'filiere' => 'required|string',
            'stage_type' => 'required|in:PFE,stage_ete',
        ]);

        try {
            // Utilisation d'une transaction pour garantir l'intégrité des données
            // Si la création de l'étudiant échoue, l'utilisateur ne sera pas créé non plus
            $result = \DB::transaction(function () use ($request) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => 'student',
                ]);

                Student::create([
                    'user_id' => $user->id,
                    'matricule' => $request->matricule,
                    'filiere' => $request->filiere,
                    'stage_type' => $request->stage_type,
                ]);

                $token = $user->createToken('auth_token')->plainTextToken;

                $user->load('student');

                return [
                    'user' => $user,
                    'token' => $token
                ];
            });

            return response()->json([
                'access_token' => $result['token'],
                'token_type' => 'Bearer',
                'user' => $result['user'],
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout utilisateur
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    /**
     * Obtenir les informations de l'utilisateur connecté
     */
    public function user(Request $request)
    {
        $user = $request->user();
        $user->load(['student', 'professor']);

        return response()->json($user);
    }

    /**
     * Mettre à jour le profil de l'utilisateur connecté
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($request->only(['name', 'email']));

        $user->load(['student', 'professor']);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user,
        ]);
    }

    /**
     * Changer le mot de passe de l'utilisateur connecté
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'message' => 'Mot de passe modifié avec succès',
        ]);
    }
}

