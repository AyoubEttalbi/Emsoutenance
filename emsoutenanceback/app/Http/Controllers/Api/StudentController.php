<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Remark;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    /**
     * Obtenir le profil de l'étudiant connecté
     */
    public function profile(Request $request)
    {
        $student = $request->user()->student;
        $student->load(['encadrant.user', 'rapporteur.user']);

        return response()->json($student);
    }

    /**
     * Déposer un rapport
     */
    public function uploadReport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
        ]);

        $student = $request->user()->student;

        if (!$student) {
            return response()->json(['message' => 'Profil étudiant non trouvé'], 404);
        }

        // Déterminer la version
        $hasInitialReport = $student->reports()->where('version', 'initial')->exists();
        $version = $hasInitialReport ? 'corrige' : 'initial';

        // Stocker le fichier
        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('reports', $filename, 'public');

        $report = Report::create([
            'student_id' => $student->id,
            'file_path' => $path,
            'original_filename' => $file->getClientOriginalName(),
            'version' => $version,
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        return response()->json($report, 201);
    }

    /**
     * Obtenir les rapports de l'étudiant
     */
    public function getReports(Request $request)
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json(['message' => 'Profil étudiant non trouvé'], 404);
        }

        $reports = $student->reports()->orderBy('created_at', 'desc')->get();

        return response()->json($reports);
    }

    /**
     * Obtenir les remarques d'un rapport
     */
    public function getRemarks(Request $request, Report $report)
    {
        // Vérifier que le rapport appartient à l'étudiant
        if ($report->student_id !== $request->user()->student->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $remarks = $report->remarks()->with('professor.user')->get();

        return response()->json($remarks);
    }

    /**
     * Obtenir les informations de la soutenance
     */
    public function getDefense(Request $request)
    {
        $student = $request->user()->student;

        if (!$student) {
            return response()->json(['message' => 'Profil étudiant non trouvé'], 404);
        }

        // Mettre à jour automatiquement les soutenances passées
        \App\Models\Defense::where('status', 'scheduled')
            ->where('scheduled_at', '<', now())
            ->update(['status' => 'completed']);

        $defense = $student->defenses()->with([
            'juryMembers.professor.user',
            'report'
        ])->latest()->first();

        return response()->json($defense);
    }
}

