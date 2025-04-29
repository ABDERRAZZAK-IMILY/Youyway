<?php

namespace App\Http\Controllers;

use App\Models\Session;
use Illuminate\Http\Request;
use App\Notifications\SessionAcceptedNotification;
use App\Notifications\SessionScheduledNotification;
use Illuminate\Support\Facades\Storage;

class SessionController extends Controller
{
    public function index()
{
    $sessions = Session::with(['student.user', 'mentor.user'])->get();
    return response()->json($sessions);
}


public function store(Request $request)
{
    $validated = $request->validate([
        'mentor_id'   => 'required|exists:mentors,id',
        'start_time'  => 'required|date',
        'end_time'    => 'required|date|after:start_time',
        'call_link'   => 'required|string',
        'title'       => 'required|string|max:255',
        'description' => 'nullable|string',
        'image'       => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('session_images', 'public');
        $validated['image_path'] = $path;
    }

    $session = Session::create($validated);

    return response()->json([
        'message' => 'Session created successfully',
        'session' => $session,
    ], 201);
}

public function update(Request $request, Session $session)
{
    $validated = $request->validate([
        'start_time'     => 'date',
        'end_time'       => 'date|after:start_time',
        'request_status' => 'in:pending,accepted,rejected',
        'title'          => 'string|max:255',
        'description'    => 'nullable|string',
        'image'          => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('image')) {
        if ($session->image_path) {
            Storage::disk('public')->delete($session->image_path);
        }
        $validated['image_path'] = $request->file('image')->store('session_images', 'public');
    }

    $session->update($validated);

    return response()->json([
        'message' => 'Session updated successfully',
        'session' => $session,
    ], 200);
}

    public function show(Session $session)
    {
        return response()->json($session);
    }

   
    public function destroy(Session $session)
    {
        $session->delete();

        return response()->json(['message' => 'Session successfully deleted'], 200);
    }

    public function acceptSession(Session $session)
    {
        $session->update(['request_status' => 'accepted']);

        $session->student->notify(new SessionAcceptedNotification($session));

        return response()->json([
            'message' => 'Session successfully accepted',
            'session' => $session,
        ], 200);
    }

    public function scheduleSession(Request $request, Session $session)
    {
        $validatedData = $request->validate([
            'scheduled_at' => 'required|date',
        ]);

        $session->update([
            'request_status' => 'scheduled',
            'scheduled_at' => $validatedData['scheduled_at'],
            'call_link' => url("/session/{$session->id}")
        ]);

        $session->student->notify(new SessionScheduledNotification($session));

        return response()->json([
            'message' => 'Session successfully scheduled',
            'session' => $session
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

    public function completeSession(Session $session)
    {
        $session->update([
            'status' => 'completed'
        ]);

        return response()->json([
            'message' => 'Session marked as completed successfully',
            'session' => $session->load(['mentor.user', 'student.user'])
        ]);
    }

 
    public function Booksession(Request $request, Session $session){
   
        $validatedData = $request->validate(['student_id' =>  'required|exists:mentors,id']);
       
        $session->update($validatedData);

        return response()->json(['message' => 'session booked succse']);

    }




}
