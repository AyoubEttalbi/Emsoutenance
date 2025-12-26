<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Professor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfessorController extends Controller
{
    /**
     * Liste de tous les professeurs
     */
    public function index(Request $request)
    {
        $professors = Professor::with(['user'])->paginate(15);

        return response()->json($professors);
    }

    /**
     * Créer un nouveau professeur
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'specialite' => 'nullable|string',
            'phone' => 'nullable|string',
            'type' => 'nullable|string', // encadrant, rapporteur, examinateur, président
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'professor',
            'type' => $request->type,
        ]);

        $professor = Professor::create([
            'user_id' => $user->id,
            'specialite' => $request->specialite,
            'phone' => $request->phone,
        ]);

        $professor->load('user');

        return response()->json($professor, 201);
    }

    /**
     * Afficher un professeur
     */
    public function show(Professor $professor)
    {
        $professor->load([
            'user',
            'studentsEncadres.user',
            'studentsRapportes.user',
            'juryDefenses.defense.student.user'
        ]);

        return response()->json($professor);
    }

    /**
     * Mettre à jour un professeur
     */
    public function update(Request $request, Professor $professor)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $professor->user_id,
            'password' => 'sometimes|nullable|string|min:8',
            'specialite' => 'nullable|string',
            'phone' => 'nullable|string',
            'type' => 'nullable|string',
        ]);

        if ($request->has('name') || $request->has('email')) {
            $professor->user->update($request->only(['name', 'email']));
        }

        if ($request->has('password') && $request->password) {
            $professor->user->update(['password' => Hash::make($request->password)]);
        }

        if ($request->has('type')) {
            $professor->user->update(['type' => $request->type]);
        }

        $professor->update($request->only(['specialite', 'phone']));

        $professor->load('user');

        return response()->json($professor);
    }

    /**
     * Supprimer un professeur
     */
    public function destroy(Professor $professor)
    {
        $professor->user->delete(); // Cela supprimera aussi le professeur grâce à la contrainte CASCADE

        return response()->json(['message' => 'Professeur supprimé avec succès']);
    }
}

