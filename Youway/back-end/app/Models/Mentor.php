<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mentor extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bio',
        'competences',
        'disponibilites',
        'domaine',
        'university',
        'image_path',
        'rating',
        'years_experience',
        'hourly_rate',
        'specialty',
        'availability',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sessions()
    {
        return $this->hasMany(Session::class);
    }
    
    public function availabilities()
    {
        return $this->hasMany(MentorAvailability::class);
    }
    
    public function reviews()
    {
        return $this->hasMany(MentorReview::class);
    }
}