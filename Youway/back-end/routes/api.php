<?php
use App\Http\Controllers\MentorController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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
    
    /*
    | Message Routes
    */
    Route::get('/messages/{sessionId}', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::patch('/messages/{id}/moderate', [MessageController::class, 'moderateMessage']);

    /*
    | Notification Routes
    */
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

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
});