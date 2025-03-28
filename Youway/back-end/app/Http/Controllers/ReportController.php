<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Validator;

class ReportController extends Controller
{
   
    public function index()
    {
        $reports = Report::all();
        return response()->json($reports);
    }


    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'message_id' => 'required|exists:messages,id',
            'reporter_id' => 'required|exists:users,id',
            'reason' => 'nullable|string',
        ]);

       
        $report = Report::create($validatedData);

        return response()->json([
            'message' => 'Report successfully created',
            'report' => $report
        ], 201);
    }

    public function show(Report $report)
    {
        return response()->json($report);
    }

  
    public function update(Request $request, Report $report)
    {
        $validatedData = $request->validate([
            'message_id' => 'exists:messages,id',
            'reporter_id' => 'exists:users,id',
            'reason' => 'nullable|string',
        ]);

        $report->update($validatedData);

        return response()->json([
            'message' => 'Report successfully updated',
            'report' => $report
        ], 200);
    }

   
    public function destroy(Report $report)
    {
        $report->delete();

        return response()->json(['message' => 'Report successfully deleted'], 200);
    }
}
