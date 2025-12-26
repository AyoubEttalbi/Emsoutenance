<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Defense;
use App\Models\JuryDefense;
use App\Models\Report;
use App\Models\Student;
use Illuminate\Http\Request;

class DefenseController extends Controller
{
    /**
     * Liste de toutes les soutenances
     */
    public function index(Request $request)
    {
        // Mettre à jour automatiquement les soutenances passées
        Defense::where('status', 'scheduled')
            ->where('scheduled_at', '<', now())
            ->update(['status' => 'completed']);

        $query = Defense::with([
            'student.user',
            'report',
            'juryMembers.professor.user'
        ]);

        // Filtrer par date
        if ($request->has('date')) {
            $query->whereDate('scheduled_at', $request->date);
        }

        // Filtrer par filière
        if ($request->has('filiere')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('filiere', $request->filiere);
            });
        }

        $defenses = $query->orderBy('scheduled_at', 'asc')->paginate(15);

        return response()->json($defenses);
    }

    /**
     * Créer une nouvelle soutenance
     */
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'report_id' => 'nullable|exists:reports,id',
            'scheduled_at' => 'required|date',
            'salle' => 'required|string',
        ]);

        // Vérifier que le rapport appartient à l'étudiant si un rapport est fourni
        if ($request->has('report_id') && $request->report_id) {
            $report = Report::findOrFail($request->report_id);
            if ($report->student_id != $request->student_id) {
                return response()->json([
                    'message' => 'Le rapport ne correspond pas à l\'étudiant'
                ], 400);
            }
        }

        $defenseData = [
            'student_id' => $request->student_id,
            'scheduled_at' => $request->scheduled_at,
            'salle' => $request->salle,
            'status' => 'scheduled',
        ];

        // Ajouter report_id seulement s'il est fourni
        if ($request->has('report_id') && $request->report_id) {
            $defenseData['report_id'] = $request->report_id;
        }

        $defense = Defense::create($defenseData);

        $defense->load(['student.user', 'report']);

        return response()->json($defense, 201);
    }

    /**
     * Afficher une soutenance
     */
    public function show(Defense $defense)
    {
        $defense->load([
            'student.user',
            'report',
            'juryMembers.professor.user'
        ]);

        return response()->json($defense);
    }

    /**
     * Mettre à jour une soutenance
     */
    public function update(Request $request, Defense $defense)
    {
        $request->validate([
            'scheduled_at' => 'sometimes|required|date',
            'salle' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:scheduled,completed,cancelled',
        ]);

        $defense->update($request->only(['scheduled_at', 'salle', 'status']));

        $defense->load(['student.user', 'report', 'juryMembers.professor.user']);

        return response()->json($defense);
    }

    /**
     * Supprimer une soutenance
     */
    public function destroy(Defense $defense)
    {
        $defense->delete();

        return response()->json(['message' => 'Soutenance supprimée avec succès']);
    }

    /**
     * Assigner le jury à une soutenance
     */
    public function assignJury(Request $request, Defense $defense)
    {
        $request->validate([
            'jury' => 'required|array|min:2',
            'jury.*.professor_id' => 'required|exists:professors,id',
            'jury.*.role' => 'required|in:encadrant,rapporteur,examinateur,president',
        ]);

        // Supprimer les anciens membres du jury
        $defense->juryMembers()->delete();

        // Ajouter les nouveaux membres
        foreach ($request->jury as $member) {
            JuryDefense::create([
                'defense_id' => $defense->id,
                'professor_id' => $member['professor_id'],
                'role' => $member['role'],
            ]);
        }

        $defense->load(['student.user', 'report', 'juryMembers.professor.user']);

        return response()->json([
            'message' => 'Jury assigné avec succès',
            'defense' => $defense
        ]);
    }
}

