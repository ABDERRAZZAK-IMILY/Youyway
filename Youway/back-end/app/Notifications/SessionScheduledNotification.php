<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class SessionScheduledNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $session;

    public function __construct($session)
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
        'message'   => "Session scheduled on {$this->session->scheduled_at}.",
        'call_link' => $this->session->call_link,
    ];
}
public function toBroadcast($notifiable)
{
    return new BroadcastMessage($this->toDatabase($notifiable));
}
public function toMail($notifiable)
{
    return (new MailMessage)
        ->subject('Session Scheduled')
        ->greeting("Hello {$notifiable->name},")
        ->line("Your session is scheduled for {$this->session->scheduled_at}.")
        ->action('Join Session', $this->session->call_link);
}

}
