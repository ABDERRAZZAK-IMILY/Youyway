<?php
 
namespace App\Http\Controllers;
 
use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
 
class MessageController extends Controller
{
    
    public function index()
    {
        try {
            $currentUser = Auth::user();
            
            if (!$currentUser) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            
            $messages = Message::where('sender_id', $currentUser->id)
                ->orWhere('recipient_id', $currentUser->id)
                ->orderBy('created_at', 'desc')
                ->get();
                
            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error in index method: ' . $e->getMessage());
            return response()->json(['error' => 'Server error', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function getInboxData()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            
            $users = User::where('id', '!=', $user->id)->get();
            
            return response()->json([
                'auth' => [
                    'user' => $user
                ],
                'users' => $users
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getInboxData: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
    
    public function getMessages($userId)
    {
        try {
            $currentUser = Auth::user();
            
            if (!$currentUser) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            
            $otherUser = User::find($userId);
            if (!$otherUser) {
                return response()->json(['error' => 'User not found'], 404);
            }
            
            $messages = Message::where(function($query) use ($currentUser, $userId) {
                $query->where('sender_id', $currentUser->id)
                      ->where('recipient_id', $userId);
            })
            ->orWhere(function($query) use ($currentUser, $userId) {
                $query->where('sender_id', $userId)
                      ->where('recipient_id', $currentUser->id);
            })
            ->orderBy('created_at', 'asc')
            ->get();
            
            return response()->json($messages);
        } catch (\Exception $e) {
            Log::error('Error in getMessages: ' . $e->getMessage());
            return response()->json(['error' => 'Server error', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function sendMessage(Request $request, $userId)
    {
        try {
            $currentUser = Auth::user();
            
            if (!$currentUser) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            
            $request->validate([
                'message' => 'required|string|max:1000',
            ]);
            
            $recipient = User::find($userId);
            if (!$recipient) {
                return response()->json(['error' => 'Recipient not found'], 404);
            }
            
            $message = new Message();
            $message->sender_id = $currentUser->id;
            $message->recipient_id = $userId;
            $message->message = $request->message;
            $message->save();
            
            broadcast(new MessageSent($message))->toOthers();
            
            return response()->json($message, 201);
        } catch (\Exception $e) {
            Log::error('Error in sendMessage: ' . $e->getMessage());
            return response()->json(['error' => 'Server error', 'message' => $e->getMessage()], 500);
        }
    }
}