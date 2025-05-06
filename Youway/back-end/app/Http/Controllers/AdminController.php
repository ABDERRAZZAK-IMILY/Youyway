<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Session;
use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
   
    public function getUsers()
    {
        try {
            $users = User::all();
            return response()->json($users, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching users: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve users', 'details' => $e->getMessage()], 500);
        }
    }
    

    public function getSessions()
    {
        try {
            $sessions = Session::all();
            return response()->json($sessions, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching sessions: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve sessions', 'details' => $e->getMessage()], 500);
        }
    }
   
    public function getStatistics()
    {
        $totalUsers = User::count();
        $totalMentors = User::where('role', 'mentor')->count();
        $totalStudents = User::where('role', 'student')->count();
        $totalSessions = Session::count();
        
    
        $completedSessions = Session::where('status', 'completed')->count();
        $pendingSessions = Session::where('status', 'pending')->count();
        
        return response()->json([
            'totalUsers' => $totalUsers,
            'totalMentors' => $totalMentors,
            'totalStudents' => $totalStudents,
            'totalSessions' => $totalSessions,
            'sessionStats' => [
                'completed' => $completedSessions,
                'pending' => $pendingSessions
            ],
        ], 200);
    }

  
    public function suspendUser(User $user)
    {
        $user->update(['status' => 'suspended']);

        return response()->json([
            'message' => 'User successfully suspended',
            'user' => $user
        ], 200);
    }

  
    public function validateMentor(User $user)
    {
         if ($user->role != 'mentor') {
            return response()->json(['message' => 'User is not a mentor'], 400);
        }

        $user->update(['status' => 'validated']);

        return response()->json([
            'message' => 'Mentor successfully validated',
            'user' => $user
        ], 200);
    }
    
   
    public function cancelSession(Session $session)
    {
        try {
            $session->update(['status' => 'cancelled']);
            
            return response()->json([
                'message' => 'Session successfully cancelled',
                'session' => $session
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error cancelling session: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to cancel session', 'details' => $e->getMessage()], 500);
        }
    }
}
