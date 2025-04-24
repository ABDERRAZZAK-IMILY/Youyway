import Echo from 'laravel-echo';

window.Echo = new Echo({
    broadcaster: 'reverb',
    wsHost: window.location.hostname,
    wsPort: 6001,
    wssPort: 6001,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: 'http://localhost:80/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
});

console.log('Echo instance loaded:', window.Echo);
