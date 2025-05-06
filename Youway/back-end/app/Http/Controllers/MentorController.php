<?php

namespace App\Http\Controllers;

use App\Models\Mentor;
use App\Models\MentorReview;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MentorController extends Controller
{
    
    public function index()
    {
        $mentors = Mentor::with('user')->get();
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
            'image'       => 'nullable|image|max:2048',

        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('session_images', 'public');
            $validatedData['image_path'] = $path;
        }
    
        $mentor = Mentor::create($validatedData);
    
        return response()->json([
            'message' => 'Mentor successfully created',
            'mentor' => $mentor
        ], 201);
    }
    


    public function show($id)
    {
        $mentor = Mentor::with('user')->findOrFail($id);
        return response()->json($mentor);
    }
    
  
    public function getReviews($id)
    {
        try {
            $mentor = Mentor::findOrFail($id);
            $reviews = MentorReview::where('mentor_id', $id)
                ->join('users', 'mentor_reviews.student_id', '=', 'users.id')
                ->select('mentor_reviews.*', 'users.name as student_name')
                ->orderBy('created_at', 'desc')
                ->get();
                
            return response()->json($reviews);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get reviews', 'details' => $e->getMessage()], 500);
        }
    }
    
  
    public function storeReview(Request $request, $id)
    {
        try {
            $mentor = Mentor::findOrFail($id);
            
            $validatedData = $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string|max:500'
            ]);
            
            $userId = Auth::id();
            
            $review = new MentorReview([
                'mentor_id' => $id,
                'student_id' => $userId,
                'rating' => $validatedData['rating'],
                'comment' => $validatedData['comment']
            ]);
            
            $review->save();
            
            $avgRating = MentorReview::where('mentor_id', $id)->avg('rating');
            $mentor->update(['rating' => $avgRating]);
            
            $student = User::find($userId);
            $review->student_name = $student ? $student->name : 'Student';
            
            return response()->json($review, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to store review', 'details' => $e->getMessage()], 500);
        }
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
            'image'          => 'nullable|image|max:2048',

        ]);
    
        if ($request->hasFile('image')) {
            if ($mentor->image_path) {
                Storage::disk('public')->delete($mentor->image_path);
            }
            $validatedData['image_path'] = $request->file('image')->store('session_images', 'public');
        }


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
