<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use App\Models\Session;

class SessionAcceptedNotification extends Notification
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
        return ['database','broadcast','mail'];
    }
    public function toDatabase($notifiable)
    {
        return [
            'message' => "Your session has been accepted.",
            'session_id' => $this->session->id,
            'type' => 'session_accepted',
            'title' => $this->session->title,
            'call_link' => $this->session->call_link
        ];
    }
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->toDatabase($notifiable));
    }
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Session Accepted: ' . $this->session->title)
            ->line('Your tutoring session request has been accepted.')
            ->line('Session Title: ' . $this->session->title)
            ->line('Start Time: ' . $this->session->start_time)
            ->line('End Time: ' . $this->session->end_time)
            ->action('Join Session', $this->session->call_link ?? url('/sessions/' . $this->session->id))
            ->line('Thank you for using our platform!');
            
    }
    
}
