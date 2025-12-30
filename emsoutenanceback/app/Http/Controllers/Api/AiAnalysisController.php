<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiFeedback;
use App\Models\Report;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class AiAnalysisController extends Controller
{

    public function analyze($reportId)
    {
        \Log::info("Starting analysis for report ID: " . $reportId);

        // 1. Initial State: Processing
        AiFeedback::updateOrCreate(
            ['report_id' => $reportId],
            [
                'grammar_issues_count' => -1, // -1 indicates processing
                'ai_feedback' => "Analyzing report content... This may take a few moments.",
            ]
        );

        try {
            $report = Report::findOrFail($reportId);
            // Use Storage::disk('public')->path() to get the absolute path from the public disk
            $filePath = Storage::disk('public')->path($report->file_path);

            if (!file_exists($filePath)) {
                throw new \Exception("Report file not found at " . $filePath);
            }

            \Log::info("Sending file to AI service: " . $filePath);

            $response = Http::timeout(60)->attach(
                'file',
                file_get_contents($filePath),
                basename($filePath)
            )->post('http://localhost:5000/api/analyze');

            if ($response->successful()) {
                $data = $response->json();
                \Log::info("AI response received for report {$reportId}", $data);

                AiFeedback::updateOrCreate(
                    ['report_id' => $reportId],
                    [
                        'grammar_issues_count' => $data['grammar_issues_count'] ?? 0,
                        'grammar_samples' => json_encode($data['grammar_samples'] ?? []),
                        'ai_feedback' => $data['ai_feedback'] ?? 'No feedback generated',
                    ]
                );
            } else {
                \Log::error("AI Service Error: " . $response->body());
                throw new \Exception("AI Service Error: " . $response->status());
            }
        } catch (\Exception $e) {
            \Log::error("AI Analysis failed for report {$reportId}: " . $e->getMessage());

            // 2. Error State
            AiFeedback::updateOrCreate(
                ['report_id' => $reportId],
                [
                    'grammar_issues_count' => -2, // -2 indicates error
                    'ai_feedback' => "Analysis failed. Please try again later. (Error: " . substr($e->getMessage(), 0, 100) . ")",
                ]
            );
        }
    }

    public function triggerAnalysis(Request $request, $id)
    {
        $this->analyze($id);
        return response()->json(['message' => 'Analysis completed']);
    }

    public function getFeedback($id)
    {
        $feedback = AiFeedback::where('report_id', $id)->firstOrFail();
        return response()->json($feedback);
    }
}
