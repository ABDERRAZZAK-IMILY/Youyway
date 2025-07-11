<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'interests' => 'nullable|string',
            'university' => 'nullable|string',
            'level' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('student_images', 'public');
            $validatedData['image_path'] = $path;
        }

        $student = Student::create($validatedData);

        return response()->json([
            'message' => 'Student successfully created',
            'student' => $student,
        ], 201);
    }

    public function show(Student $student)
    {
        $student->load('user');
        
        return response()->json($student);
    }
    

  
    public function update(Request $request, Student $student)
    {
        $validatedData = $request->validate([
            'user_id' => 'exists:users,id',
            'interests' => 'nullable|string',
            'university' => 'nullable|string',
            'level' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($student->image_path) {
                Storage::disk('public')->delete($student->image_path);
            }

            $validatedData['image_path'] = $request->file('image')->store('student_images', 'public');
        }

        $student->update($validatedData);

        return response()->json([
            'message' => 'Student successfully updated',
            'student' => $student,
        ], 200);
    }

    public function destroy(Student $student)
    {
        if ($student->image_path) {
            Storage::disk('public')->delete($student->image_path);
        }

        $student->delete();

        return response()->json(['message' => 'Student successfully deleted'], 200);
    }

    public function myStudent()
    {
        $user = Auth::user();
        $student = Student::where('user_id', $user->id)->with('user')->first();

        if (!$student) {
            return response()->json(['message' => 'Student profile not found'], 404);
        }

        return response()->json($student);
    }
}
