<?php
use App\Http\Controllers\MentorController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

Route::post('register', [AuthController::class, 'register']);


Route::post('login' ,[AuthController::class, 'login'] );


Route::apiResource('mentors', MentorController::class);
Route::get('/mentors/search', [MentorController::class, 'search']);