<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReportUploadRequest;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    public function upload(ReportUploadRequest $request)
    {
        try {
            $path = $request->file('report')->store('reports', 'public');

            $report = Report::create([
                'student_id' => $request->user()->student->id,
                'file_path' => $path,
                'original_filename' => $request->file('report')->getClientOriginalName(),
                'version' => $request->version,
                'status' => 'pending',
                'submitted_at' => now(),
            ]);

            $aiController = new AiAnalysisController();
            $aiController->analyze($report->id);

            return response()->json([
                'message' => 'Report uploaded and analysis triggered',
                'report_id' => $report->id
            ], 201);
        } catch (\Exception $e) {
            file_put_contents(storage_path('logs/debug_upload.log'), $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Get all reports with AI feedback for the authenticated student
     */
    public function getHistory(Request $request)
    {
        try {
            $studentId = $request->user()->student->id;

            $reports = Report::with('aiFeedback')
                ->where('student_id', $studentId)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($report) {
                    $aiFeedback = $report->aiFeedback;
                    $parsedFeedback = null;
                    $grade = null;
                    $niveau = null;

                    if ($aiFeedback && $aiFeedback->ai_feedback) {
                        try {
                            $parsedFeedback = json_decode($aiFeedback->ai_feedback, true);
                            $grade = $parsedFeedback['note_globale'] ?? null;
                            $niveau = $parsedFeedback['niveau'] ?? null;
                        } catch (\Exception $e) {
                            // JSON parsing failed, use raw feedback
                        }
                    }

                    return [
                        'id' => $report->id,
                        'filename' => $report->original_filename,
                        'version' => $report->version,
                        'status' => $report->status,
                        'submitted_at' => $report->submitted_at,
                        'created_at' => $report->created_at,
                        'grade' => $grade,
                        'niveau' => $niveau,
                        'has_feedback' => $aiFeedback !== null && $aiFeedback->grammar_issues_count >= 0,
                        'is_processing' => $aiFeedback && $aiFeedback->grammar_issues_count === -1,
                    ];
                });

            return response()->json($reports);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
