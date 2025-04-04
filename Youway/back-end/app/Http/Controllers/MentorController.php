<?php

namespace App\Http\Controllers;

use App\Models\Mentor;
use Illuminate\Http\Request;

class MentorController extends Controller
{
    
    public function index()
    {
        $mentors = Mentor::all();
        return response()->json($mentors);
    }

  
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'bio' => 'nullable|string',
            'competences' => 'nullable|string',
            'disponibilites' => 'nullable|string',
            'domaine' => 'nullable|string',
            'university' => 'nullable|string',
        ]);
    
        $mentor = Mentor::create($validatedData);
    
        return response()->json([
            'message' => 'Mentor successfully created',
            'mentor' => $mentor
        ], 201);
    }
    


    public function show(Mentor $mentor)
    {
        return response()->json($mentor);
    }

  
    public function update(Request $request, Mentor $mentor)
    {
        $validatedData = $request->validate([
            'user_id' => 'exists:users,id',
            'bio' => 'nullable|string',
            'competences' => 'nullable|string',
            'disponibilites' => 'nullable|string',
            'domaine' => 'nullable|string',
            'university' => 'nullable|string',
        ]);
    
        $mentor->update($validatedData);
    
        return response()->json([
            'message' => 'Mentor successfully updated',
            'mentor' => $mentor
        ], 200);
    }
    

    public function destroy(Mentor $mentor)
    {
        $mentor->delete();

        return response()->json(['message' => 'Mentor successfully deleted'], 200);
    }

    public function search(Request $request)
    {
        $validatedData = $request->validate([
            'domaine' => 'nullable|string',
            'competences' => 'nullable|string',
            'university' => 'nullable|string',
        ]);
    
        $query = Mentor::query();
    
        if (!empty($validatedData['domaine'])) {
            $query->where('domaine', 'like', '%' . $validatedData['domaine'] . '%');
        }
    
        if (!empty($validatedData['competences'])) {
            $query->where('competences', 'like', '%' . $validatedData['competences'] . '%');
        }
    
        if (!empty($validatedData['university'])) {
            $query->where('university', 'like', '%' . $validatedData['university'] . '%');
        }
    
        $mentors = $query->get();
    
        return response()->json($mentors);
    }
    
}
