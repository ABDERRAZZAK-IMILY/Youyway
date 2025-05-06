<?php

namespace App\Http\Controllers;

use App\Models\Mentor;
use App\Models\MentorAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


class MentorAvailabilityController extends Controller
{
  
    public function index($mentorId)
    {
        try {
            $mentor = Mentor::findOrFail($mentorId);
            $availabilities = $mentor->availabilities()
                ->orderBy('date', 'asc')
                ->orderBy('start_time', 'asc')
                ->get();
                
            return response()->json($availabilities);
        } catch (\Exception $e) {
            Log::error('Error fetching mentor availabilities: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching availabilities'], 500);
        }
    }

  
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mentor_id' => 'required|exists:mentors,id',
            'date' => 'required|date',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
        ]);

        Log::info('Availability data received:', $request->all());

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $mentor = Mentor::find($request->mentor_id);
        
        if (!$mentor || ($mentor->user_id !== $user->id )) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $existingSlot = MentorAvailability::where('mentor_id', $request->mentor_id)
                ->where(function ($query) use ($request) {
                    $query->where(function ($q) use ($request) {
                        $q->where('start_time', '<=', $request->start_time)
                          ->where('end_time', '>', $request->start_time);
                    })->orWhere(function ($q) use ($request) {
                        $q->where('start_time', '<', $request->end_time)
                          ->where('end_time', '>=', $request->end_time);
                    })->orWhere(function ($q) use ($request) {
                        $q->where('start_time', '>=', $request->start_time)
                          ->where('end_time', '<=', $request->end_time);
                    });
                })
                ->first();

            if ($existingSlot) {
                return response()->json(['message' => 'Overlapping availability slot exists'], 422);
            }

            try {
                $availability = MentorAvailability::create([
                    'mentor_id' => $request->mentor_id,
                    'date' => $request->date,
                    'start_time' => $request->start_time,
                    'end_time' => $request->end_time,
                    'is_booked' => false,
                ]);
            } catch (\Exception $e) {
                Log::error('Error creating availability record: ' . $e->getMessage());
                return response()->json(['message' => 'Error creating availability: ' . $e->getMessage()], 500);
            }

            return response()->json($availability, 201);
        } catch (\Exception $e) {
            Log::error('Error creating availability: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating availability'], 500);
        }
    }

 
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'sometimes|date|after_or_equal:today',
            'start_time' => 'sometimes|date_format:Y-m-d\TH:i:s',
            'end_time' => 'sometimes|date_format:Y-m-d\TH:i:s|after:start_time',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $availability = MentorAvailability::findOrFail($id);
            
            $user = Auth::user();
            $mentor = Mentor::find($availability->mentor_id);
            
            if (!$mentor || ($mentor->user_id !== $user->id)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            if ($availability->is_booked) {
                return response()->json(['message' => 'Cannot update a booked availability slot'], 422);
            }

            if ($request->has('start_time') || $request->has('end_time') || $request->has('date')) {
                $startTime = $request->start_time ?? $availability->start_time;
                $endTime = $request->end_time ?? $availability->end_time;
                
                $existingSlot = MentorAvailability::where('mentor_id', $availability->mentor_id)
                    ->where('id', '!=', $id)
                    ->where(function ($query) use ($startTime, $endTime) {
                        $query->where(function ($q) use ($startTime, $endTime) {
                            $q->where('start_time', '<=', $startTime)
                              ->where('end_time', '>', $startTime);
                        })->orWhere(function ($q) use ($startTime, $endTime) {
                            $q->where('start_time', '<', $endTime)
                              ->where('end_time', '>=', $endTime);
                        })->orWhere(function ($q) use ($startTime, $endTime) {
                            $q->where('start_time', '>=', $startTime)
                              ->where('end_time', '<=', $endTime);
                        });
                    })
                    ->first();

                if ($existingSlot) {
                    return response()->json(['message' => 'Overlapping availability slot exists'], 422);
                }
            }

            $availability->update($request->only(['date', 'start_time', 'end_time']));

            return response()->json($availability);
        } catch (\Exception $e) {
            Log::error('Error updating availability: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating availability'], 500);
        }
    }

    
    public function destroy($id)
    {
        try {
            $availability = MentorAvailability::findOrFail($id);
            
            $user = Auth::user();
            $mentor = Mentor::find($availability->mentor_id);
            
            if (!$mentor || ($mentor->user_id !== $user->id)) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            if ($availability->is_booked) {
                return response()->json(['message' => 'Cannot delete a booked availability slot'], 422);
            }

            $availability->delete();
            return response()->json(['message' => 'Availability slot deleted']);
        } catch (\Exception $e) {
            Log::error('Error deleting availability: ' . $e->getMessage());
            return response()->json(['message' => 'Error deleting availability'], 500);
        }
    }
}
