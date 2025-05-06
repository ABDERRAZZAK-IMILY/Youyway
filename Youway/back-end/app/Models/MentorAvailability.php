<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorAvailability extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'mentor_id',
        'date',
        'start_time',
        'end_time',
        'is_booked',
    ];

 
    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_booked' => 'boolean',
    ];

   
    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }
}
