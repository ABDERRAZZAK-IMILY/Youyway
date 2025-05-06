<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use App\Models\Session;

class SessionCompletedNotification extends Notification
{
    use Queueable;

    protected $session;

    /**
     * Create a new notification instance.
     */
    public function __construct(Session $session)
    {
        $this->session = $session;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => "Your session has been marked as completed.",
            'session_id' => $this->session->id,
            'type' => 'session_completed',
            'title' => $this->session->title
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->toDatabase($notifiable));
    }
    
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Session Completed')
            ->line('Your tutoring session titled "' . $this->session->title . '" has been marked as completed.')
            ->line('Thank you for using YouWay!');
    }
}
