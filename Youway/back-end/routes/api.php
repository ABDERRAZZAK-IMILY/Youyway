<?php
use App\Http\Controllers\MentorController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Auth;

Route::middleware('auth:api')->group(function () {
    Route::get('/messages', [MessageController::class, 'index']);
    
    Route::get('/messages/{userId}', [MessageController::class, 'getMessages']);
    
    Route::post('/messages/{userId}', [MessageController::class, 'sendMessage']);
    
    Route::get('/inbox-data', [MessageController::class, 'getInboxData']);
});

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    /*
    | Mentor Routes
    */
    Route::apiResource('mentors', MentorController::class);
    Route::get('/mentors/search', [MentorController::class, 'search']);
    Route::get('/mentors/{mentor}/statistics', [MentorController::class, 'getStatistics']);

    /*
    | Student Routes
    */
    Route::apiResource('students', StudentController::class);
    Route::get('/students/{student}/sessions', [StudentController::class, 'getSessions']);

    /*
    | Session Routes
    */
    Route::apiResource('sessions', SessionController::class);
    Route::put('/sessions/{session}/accept', [SessionController::class, 'acceptSession']);
    Route::put('/sessions/{session}/reject', [SessionController::class, 'rejectSession']);
    Route::put('/sessions/{session}/complete', [SessionController::class, 'completeSession']);
    Route::put('sessions/{session}/schedule', [SessionController::class, 'scheduleSession']);
    
    /*
    | Message Routes
    */
    Route::get('/messages/{sessionId}', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::patch('/messages/{id}/modify', [MessageController::class, 'modifyMessage']);
    
    /*
    | Inbox Routes
    */
    Route::get('/inbox-data', [MessageController::class, 'getInboxData']);
    Route::get('/messages/{userId}', [MessageController::class, 'getMessages']);
    Route::post('/messages/{userId}', [MessageController::class, 'sendMessage']);

    /*
    | Notification Routes
    */
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::patch('/notifications/read', [NotificationController::class, 'markAsRead']);

    /*
    | Admin Routes
    */
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/statistics', [AdminController::class, 'getStatistics']);
        Route::get('/admin/users', [AdminController::class, 'getUsers']);
        Route::patch('/admin/users/{user}/suspend', [AdminController::class, 'suspendUser']);
        Route::patch('/admin/users/{user}/activate', [AdminController::class, 'activateUser']);
        Route::get('/admin/reports', [AdminController::class, 'getReports']);
        Route::post('/admin/users/{user}/validate', [AdminController::class, 'validateMentor']);
    });
    /*
    | Evaluation Routes
    */
    Route::post('/sessions/{session}/evaluate', [SessionController::class, 'store']);
    Route::get('/sessions/{session}/evaluation', [SessionController::class, 'show']);
    Route::put('/sessions/{session}/evaluation', [SessionController::class, 'update']);


    /*
    | student Routes
    */


    Route::apiResource('student', StudentController::class);


    Route::post('/book' , [SessionController::class , 'Booksession'] );
    


    Route::get('/my-mentor', function () {
        $user = Auth::user();
        $mentor = $user->mentor;
        if (!$mentor) {
            return response()->json(['message' => 'Mentor not found'], 404);
        }
        return response()->json($mentor);
    })->middleware('auth:api');
    

    Route::get('/my-student', function () {
        $user = Auth::user();
        $mentor = $user->student;
        if (!$mentor) {
            return response()->json(['message' => 'Mentor not found'], 404);
        }
        return response()->json($mentor);
    })->middleware('auth:api');


});


