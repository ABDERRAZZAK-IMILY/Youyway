<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentor_id')
            ->constrained('mentors')
            ->cascadeOnDelete();

            $table->foreignId('student_id')
            ->nullable()
            ->constrained('students')
            ->cascadeOnDelete();
      

            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->string('status')->default('pending');
            $table->string('request_status')->default('pending')->check("request_status in ('pending', 'accepted', 'rejected')");
            $table->dateTime('scheduled_at')->nullable()->after('request_status');
            $table->string('call_link')->nullable()->after('scheduled_at');
            $table->timestamps();
            $table->string('title')->after('id');
            $table->text('description')->nullable()->after('title');
            $table->string('image_path')->nullable()->after('call_link');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sessions');
    }
};