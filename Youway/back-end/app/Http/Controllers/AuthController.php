<?php
 
 namespace App\Http\Controllers;
 
 use App\Models\User;
 use Illuminate\Http\Request;
 use Illuminate\Support\Facades\Hash;
 
 
 class AuthController extends Controller
 {
 
     public function register(Request $request)
     {
     // Create new user
     $user = User::create([
     'name' => $request->name,
     'email' => $request->email,
     'password' => Hash::make($request->password),
     'role' => $request->role,
     ]);
     // Generate JWT token
     $token = auth('api')->login($user);
     // Return user data and token
     return response()->json([
     'status' => 'success',
     'message' => 'User registered successfully',
     'user' => $user,
     'authorization' => [
     'token' => $token,
     'type' => 'bearer',
     ]
     ], 201);
     }
 
     public function login(Request $request)
     {
      
   
 $request->validate([
     'email' => 'required|email',
     'password' => 'required',
 ]);
 
 
 $credentials = $request->only('email', 'password');
 
 if (!$token = auth('api')->attempt($credentials)) {
     return response()->json([
         'status' => 'error',
         'message' => 'Unauthorized',
     ], 401);
 }
 
 $user = auth('api')->user();
 
 return response()->json([
     'status' => 'success',
     'user' => $user,
     'authorization' => [
         'token' => $token,
         'type' => 'bearer',
     ]
 ]);
 
 
 }
    
 
 }