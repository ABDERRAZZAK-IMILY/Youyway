<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use App\Models\Session;

class SessionRejectedNotification extends Notification
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
            'message' => "Your session request has been rejected.",
            'session_id' => $this->session->id,
            'type' => 'session_rejected',
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
            ->subject('Session Request Rejected')
            ->line('Your tutoring session request titled "' . $this->session->title . '" has been rejected.')
            ->line('You can book another session with a different mentor.');
    }
}
