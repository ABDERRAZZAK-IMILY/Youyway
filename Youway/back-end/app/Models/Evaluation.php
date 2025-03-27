<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'mentor_id',
        'student_id',
        'teaching_quality',
        'communication',
        'knowledge',
        'punctuality',
        'strengths',
        'areas_for_improvement',
        'rating',
        'comment',
    ];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }

    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
