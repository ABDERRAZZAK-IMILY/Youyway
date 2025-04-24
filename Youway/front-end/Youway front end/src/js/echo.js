import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher; 

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '14093af63cb0b67fb854',
    cluster: 'eu',
    forceTLS: true,
});
