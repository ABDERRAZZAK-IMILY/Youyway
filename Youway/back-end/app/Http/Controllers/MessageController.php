<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Events\NewMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Request $request, $sessionId)
    {
        $messages = Message::where('session_id', $sessionId)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();
            
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'session_id' => 'required|exists:session,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'session_id' => $validatedData['session_id'],
            'sender_id' => Auth::id(),
            'content' => $validatedData['content'],
        ]);

        $message->load('sender');

        broadcast(new NewMessage($message))->toOthers();

        return response()->json($message, 201);
    }
}