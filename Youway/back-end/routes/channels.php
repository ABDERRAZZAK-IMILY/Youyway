<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Add this channel for messages
Broadcast::channel('message.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
