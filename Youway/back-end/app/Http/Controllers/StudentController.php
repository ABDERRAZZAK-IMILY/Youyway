<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{

    public function index()
    {
        $students = Student::all();
        return response()->json($students);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'interests' => 'nullable|string',
            'university' => 'nullable|string',
            'level' => 'nullable|string',
        ]);

        $student = Student::create($validatedData);

        return response()->json([
            'message' => 'Student successfully created',
            'student' => $student,
        ], 201);
    }

    public function show(Student $student)
    {
        return response()->json($student);
    }

    public function update(Request $request, Student $student)
    {
        $validatedData = $request->validate([
            'user_id' => 'exists:users,id',
            'interests' => 'nullable|string',
            'university' => 'nullable|string',
            'level' => 'nullable|string',
        ]);

        $student->update($validatedData);

        return response()->json([
            'message' => 'Student successfully updated',
            'student' => $student,
        ], 200);
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return response()->json(['message' => 'Student successfully deleted'], 200);
    }
}
