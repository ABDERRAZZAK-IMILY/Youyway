<?php

namespace App\Http\Controllers;

use App\Models\Session;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function index()
    {
        $sessions = Session::all();
        return response()->json($sessions);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'mentor_id' => 'required|exists:mentors,id',
            'student_id' => 'required|exists:students,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'status' => 'nullable|string',
        ]);

        $session = Session::create($validatedData);

        return response()->json([
            'message' => 'Session successfully created',
            'session' => $session,
        ], 201);
    }

    public function show(Session $session)
    {
        return response()->json($session);
    }

    public function update(Request $request, Session $session)
    {
        $validatedData = $request->validate([
            'mentor_id' => 'exists:mentors,id',
            'student_id' => 'exists:students,id',
            'start_time' => 'date',
            'end_time' => 'date|after:start_time',
            'status' => 'nullable|string',
            'request_status' => 'in:pending,accepted,rejected',
        ]);

        $session->update($validatedData);

        return response()->json([
            'message' => 'Session successfully updated',
            'session' => $session,
        ], 200);
    }

    public function destroy(Session $session)
    {
        $session->delete();

        return response()->json(['message' => 'Session successfully deleted'], 200);
    }

    public function acceptSession(Session $session)
    {
        $session->update(['request_status' => 'accepted']);

        return response()->json([
            'message' => 'Session successfully accepted',
            'session' => $session,
        ], 200);
    }

    public function rejectSession(Session $session)
    {
        $session->update(['request_status' => 'rejected']);

        return response()->json([
            'message' => 'Session successfully rejected',
            'session' => $session,
        ], 200);
    }
}
