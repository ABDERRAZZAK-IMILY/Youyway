<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'mentor_id',
        'student_id',
        'rating',
        'comment'
    ];

 
    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }


    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
