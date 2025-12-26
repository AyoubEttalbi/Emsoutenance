<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Models\Professor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    /**
     * Liste de tous les étudiants
     */
    public function index(Request $request)
    {
        $query = Student::with(['user', 'encadrant.user', 'rapporteur.user']);

        // Filtrer par filière
        if ($request->has('filiere')) {
            $query->where('filiere', $request->filiere);
        }

        // Filtrer par type de stage
        if ($request->has('stage_type')) {
            $query->where('stage_type', $request->stage_type);
        }

        // Si on demande tous les étudiants (pour les select/combobox)
        if ($request->has('all') && $request->all == '1') {
            $students = $query->get();
            return response()->json(['data' => $students]);
        }

        $students = $query->paginate(15);

        return response()->json($students);
    }

    /**
     * Créer un nouvel étudiant
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'matricule' => 'required|string|unique:students',
            'filiere' => 'required|string',
            'stage_type' => 'required|in:PFE,stage_ete',
            'phone' => 'nullable|string',
            'encadrant_id' => 'nullable|exists:professors,id',
            'rapporteur_id' => 'nullable|exists:professors,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student',
        ]);

        $student = Student::create([
            'user_id' => $user->id,
            'matricule' => $request->matricule,
            'filiere' => $request->filiere,
            'stage_type' => $request->stage_type,
            'phone' => $request->phone,
            'encadrant_id' => $request->encadrant_id,
            'rapporteur_id' => $request->rapporteur_id,
        ]);

        $student->load(['user', 'encadrant.user', 'rapporteur.user']);

        return response()->json($student, 201);
    }

    /**
     * Afficher un étudiant
     */
    public function show(Student $student)
    {
        $student->load(['user', 'encadrant.user', 'rapporteur.user', 'reports', 'defenses.juryMembers.professor.user']);

        return response()->json($student);
    }

    /**
     * Mettre à jour un étudiant
     */
    public function update(Request $request, Student $student)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $student->user_id,
            'password' => 'sometimes|nullable|string|min:8',
            'matricule' => 'sometimes|required|string|unique:students,matricule,' . $student->id,
            'filiere' => 'sometimes|required|string',
            'stage_type' => 'sometimes|required|in:PFE,stage_ete',
            'phone' => 'nullable|string',
            'encadrant_id' => 'nullable|exists:professors,id',
            'rapporteur_id' => 'nullable|exists:professors,id',
        ]);

        if ($request->has('name') || $request->has('email')) {
            $student->user->update($request->only(['name', 'email']));
        }

        if ($request->has('password') && $request->password) {
            $student->user->update(['password' => Hash::make($request->password)]);
        }

        $student->update($request->only([
            'matricule',
            'filiere',
            'stage_type',
            'phone',
            'encadrant_id',
            'rapporteur_id',
        ]));

        $student->load(['user', 'encadrant.user', 'rapporteur.user']);

        return response()->json($student);
    }

    /**
     * Supprimer un étudiant
     */
    public function destroy(Student $student)
    {
        $student->user->delete(); // Cela supprimera aussi l'étudiant grâce à la contrainte CASCADE

        return response()->json(['message' => 'Étudiant supprimé avec succès']);
    }
}

