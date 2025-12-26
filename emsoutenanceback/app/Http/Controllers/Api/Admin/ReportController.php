<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Liste de tous les rapports
     */
    public function index(Request $request)
    {
        $query = Report::with(['student.user', 'remarks.professor.user']);

        // Filtrer par statut
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filtrer par version
        if ($request->has('version')) {
            $query->where('version', $request->version);
        }

        $reports = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($reports);
    }

    /**
     * Valider un rapport (après validation du rapporteur)
     */
    public function validateReport(Request $request, Report $report)
    {
        // L'admin peut valider définitivement un rapport après validation du rapporteur
        if ($report->status !== 'validated') {
            return response()->json([
                'message' => 'Le rapport doit être validé par le rapporteur avant validation finale'
            ], 400);
        }

        // Ici, l'admin peut déclencher la création du jury
        // Pour simplifier, on considère que c'est validé

        return response()->json([
            'message' => 'Rapport validé avec succès',
            'report' => $report
        ]);
    }
}

