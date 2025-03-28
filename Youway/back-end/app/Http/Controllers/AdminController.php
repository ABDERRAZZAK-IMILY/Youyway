<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Session;
use App\Models\Evaluation;
use Illuminate\Http\Request;

class AdminController extends Controller
{
   
    public function getStatistics()
    {
        $totalUsers = User::count();
        $totalMentors = User::where('role', 'mentor')->count();
        $totalStudents = User::where('role', 'student')->count();
        $totalSessions = Session::count();
        
        $evaluationStats = [
            'teaching_quality' => Evaluation::avg('teaching_quality'),
            'communication' => Evaluation::avg('communication'),
            'knowledge' => Evaluation::avg('knowledge'),
            'punctuality' => Evaluation::avg('punctuality'),
            'overall_rating' => Evaluation::avg('rating')
        ];
        
        $activeUsers = User::where('last_activity_at', '>=', now()->subDays(30))->count();
        $completedSessions = Session::where('status', 'completed')->count();
        $pendingSessions = Session::where('status', 'pending')->count();
        
        return response()->json([
            'totalUsers' => $totalUsers,
            'totalMentors' => $totalMentors,
            'totalStudents' => $totalStudents,
            'totalSessions' => $totalSessions,
            'activeUsers' => $activeUsers,
            'sessionStats' => [
                'completed' => $completedSessions,
                'pending' => $pendingSessions
            ],
            'evaluationStats' => $evaluationStats
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
}
