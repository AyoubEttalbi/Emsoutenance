<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Defense;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Planning global des soutenances
     */
    public function index(Request $request)
    {
        $query = Defense::with([
            'student.user',
            'report',
            'juryMembers.professor.user'
        ]);

        // Filtrer par date
        if ($request->has('date')) {
            $query->whereDate('scheduled_at', $request->date);
        }

        // Filtrer par date de début et fin
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('scheduled_at', [
                $request->start_date,
                $request->end_date
            ]);
        }

        $defenses = $query->orderBy('scheduled_at', 'asc')->get();

        return response()->json($defenses);
    }

    /**
     * Planning par filière
     */
    public function byFiliere(Request $request)
    {
        $request->validate([
            'filiere' => 'required|string',
        ]);

        $defenses = Defense::with([
            'student.user',
            'report',
            'juryMembers.professor.user'
        ])
        ->whereHas('student', function ($query) use ($request) {
            $query->where('filiere', $request->filiere);
        })
        ->orderBy('scheduled_at', 'asc')
        ->get();

        return response()->json($defenses);
    }

    /**
     * Planning par encadrant
     */
    public function byEncadrant(Request $request)
    {
        $request->validate([
            'encadrant_id' => 'required|exists:professors,id',
        ]);

        $defenses = Defense::with([
            'student.user',
            'report',
            'juryMembers.professor.user'
        ])
        ->whereHas('student', function ($query) use ($request) {
            $query->where('encadrant_id', $request->encadrant_id);
        })
        ->orderBy('scheduled_at', 'asc')
        ->get();

        return response()->json($defenses);
    }
}

