<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EvaluationController extends Controller
{
    

    public function store(Request $request, Session $session)
    {
        $user = Auth::user();
        if ($user->id !== $session->student_id && $user->id !== $session->mentor_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'teaching_quality' => 'required|integer|min:1|max:5',
            'communication' => 'required|integer|min:1|max:5',
            'knowledge' => 'required|integer|min:1|max:5',
            'punctuality' => 'required|integer|min:1|max:5',
            'strengths' => 'required|string',
            'areas_for_improvement' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string'
        ]);

        $evaluation = Evaluation::create([
            'session_id' => $session->id,
            'mentor_id' => $session->mentor_id,
            'student_id' => $session->student_id,
            'teaching_quality' => $validatedData['teaching_quality'],
            'communication' => $validatedData['communication'],
            'knowledge' => $validatedData['knowledge'],
            'punctuality' => $validatedData['punctuality'],
            'strengths' => $validatedData['strengths'],
            'areas_for_improvement' => $validatedData['areas_for_improvement'],
            'rating' => $validatedData['rating'],
            'comment' => $validatedData['comment']
        ]);

        return response()->json([
            'message' => 'Evaluation submitted successfully',
            'evaluation' => $evaluation
        ], 201);
    }

    public function show(Session $session)
    {
        $user = Auth::user();
        if ($user->id !== $session->student_id && $user->id !== $session->mentor_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $evaluation = Evaluation::where('session_id', $session->id)->first();
        if (!$evaluation) {
            return response()->json(['message' => 'Evaluation not found'], 404);
        }

        return response()->json($evaluation);
    }

    public function update(Request $request, Session $session)
    {
        $user = Auth::user();
        $evaluation = Evaluation::where('session_id', $session->id)->first();

        if (!$evaluation) {
            return response()->json(['message' => 'Evaluation not found'], 404);
        }

        if ($user->id !== $evaluation->student_id && $user->id !== $evaluation->mentor_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'teaching_quality' => 'required|integer|min:1|max:5',
            'communication' => 'required|integer|min:1|max:5',
            'knowledge' => 'required|integer|min:1|max:5',
            'punctuality' => 'required|integer|min:1|max:5',
            'strengths' => 'required|string',
            'areas_for_improvement' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string'
        ]);

        $evaluation->update($validatedData);

        return response()->json([
            'message' => 'Evaluation updated successfully',
            'evaluation' => $evaluation
        ]);
    }
}