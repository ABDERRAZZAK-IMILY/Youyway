<?php
use App\Http\Controllers\MentorController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\StudentController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

Route::post('register', [AuthController::class, 'register']);


Route::post('login' ,[AuthController::class, 'login'] );


Route::apiResource('mentors', MentorController::class);
Route::get('/mentors/search', [MentorController::class, 'search']);

Route::apiResource('students', StudentController::class);



Route::apiResource('sessions', SessionController::class);
Route::put('/sessions/{session}/accept', [SessionController::class, 'acceptSession']);
Route::put('/sessions/{session}/reject', [SessionController::class, 'rejectSession']);