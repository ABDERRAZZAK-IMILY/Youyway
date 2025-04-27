
import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';                               
import { axiosClient } from '../../api/axios';                        
import Echo from 'laravel-echo';                                     
import Pusher from 'pusher-js';


window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: 'pusher',
  key: '14093af63cb0b67fb854',
  cluster: 'eu',
  forceTLS: true,
  authEndpoint: "/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
});

export default function Header() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const { sub: userId, name } = jwtDecode(token);
    setUser({ id: userId, name });                                   

    axiosClient
      .get(`/notifications?unread=1`)
      .then(res => setNotifications(res.data.data || []));

    const channel = window.Echo.private(`notifications.${userId}`);
    channel.listen('NewNotification', event => {
      setNotifications(prev => [event, ...prev]);
    });

    return () => {
      channel.stopListening('NewNotification');
      window.Echo.leave(`notifications.${userId}`);
    };
  }, []);

  return (
    <header className="flex items-center justify-between bg-white p-4 border-b">
      <div className="text-2xl font-semibold">Youyway</div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="relative focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 64 64">
<path fill="#c2cde7" d="M33,47c-3.314,0-6,2.686-6,6s2.686,6,6,6s6-2.686,6-6S36.314,47,33,47z"></path><path fill="#8d6c9f" d="M33,60c-3.86,0-7-3.141-7-7s3.14-7,7-7c3.859,0,7,3.141,7,7S36.859,60,33,60z M33,48 c-2.757,0-5,2.243-5,5s2.243,5,5,5s5-2.243,5-5S35.757,48,33,48z"></path><path fill="#f9e3ae" d="M57.87,52.09c-0.175,0.339-0.528,0.548-0.91,0.54H9c-0.552,0.024-1.019-0.403-1.043-0.955 C7.946,51.43,8.025,51.19,8.18,51l4.43-6.64l1.18-2.06c0.501-1.049,0.838-2.169,1-3.32L17,21.1 c0.845-6.694,6.533-11.718,13.28-11.73h5.44C42.467,9.382,48.155,14.406,49,21.1L51.25,39c0.222,1.745,0.845,3.416,1.82,4.88 L57.82,51C58.051,51.321,58.07,51.749,57.87,52.09z"></path><path fill="#faefde" d="M45.83,14c-2.539-2.937-6.228-4.626-10.11-4.63h-5.44c-3.882,0.004-7.571,1.693-10.11,4.63H45.83z"></path><path fill="#f6d397" d="M56.16,53H9.84c-1.105,0.002-2.002-0.892-2.004-1.996C7.836,50.591,7.963,50.188,8.2,49.85L13,43 h40l4.8,6.85c0.635,0.904,0.417,2.151-0.486,2.786C56.976,52.874,56.573,53.001,56.16,53z"></path><path fill="#8d6c9f" d="M58.76,49.34l-4.62-6.93c-0.775-1.164-1.268-2.492-1.44-3.88l-2.18-17.39 c-0.797-6.322-5.5-11.451-11.73-12.79l-1.34-2.69C36.941,4.641,35.899,3.998,34.76,4h-3.52c-1.135,0.002-2.173,0.644-2.68,1.66 l-1.35,2.69c-6.23,1.339-10.933,6.468-11.73,12.79L13.3,38.53c-0.172,1.388-0.665,2.716-1.44,3.88l-4.62,6.93 c-0.917,1.38-0.541,3.242,0.839,4.159C8.571,53.826,9.149,54,9.74,54h46.52c1.657,0.001,3-1.342,3.001-2.999 C59.261,50.41,59.087,49.832,58.76,49.34z M30.34,6.55c0.171-0.34,0.52-0.553,0.9-0.55h3.53c0.377,0.001,0.721,0.214,0.89,0.55 L36.4,8c-0.25,0-0.5,0-0.76,0h-5.28c-0.26,0-0.51,0-0.76,0L30.34,6.55z M57.14,51.47c-0.173,0.325-0.511,0.529-0.88,0.53H9.74 c-0.552-0.003-0.998-0.453-0.995-1.005c0.001-0.194,0.058-0.383,0.165-0.545L13.2,44l1.15-2c0.476-1.019,0.793-2.105,0.94-3.22 l2.17-17.39C18.272,14.883,23.803,10,30.36,10h5.28c6.557,0,12.088,4.883,12.9,11.39l2.17,17.39 c0.213,1.695,0.815,3.317,1.76,4.74l4.62,6.93C57.292,50.755,57.311,51.146,57.14,51.47z"></path><path fill="#8d6c9f" d="M18,46c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2C19,46.448,18.552,46,18,46z"></path><path fill="#8d6c9f" d="M13,46c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2C14,46.448,13.552,46,13,46z"></path><path fill="#8d6c9f" d="M23,46c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2C24,46.448,23.552,46,23,46z"></path><path fill="#8d6c9f" d="M28,46c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2C29,46.448,28.552,46,28,46z"></path><path fill="#8d6c9f" d="M33,46c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2C34,46.448,33.552,46,33,46z"></path><path fill="#8d6c9f" d="M38,46c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2C39,46.448,38.552,46,38,46z"></path><path fill="#8d6c9f" d="M43,46c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2C44,46.448,43.552,46,43,46z"></path><path fill="#8d6c9f" d="M48,46c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2C49,46.448,48.552,46,48,46z"></path><path fill="#8d6c9f" d="M53,46c-0.552,0-1,0.448-1,1v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2C54,46.448,53.552,46,53,46z"></path><g><path fill="#8d6c9f" d="M41,44H13c-0.552,0-1-0.447-1-1s0.448-1,1-1h28c0.553,0,1,0.447,1,1S41.553,44,41,44z"></path><path fill="#8d6c9f" d="M49,44h-4c-0.553,0-1-0.447-1-1s0.447-1,1-1h4c0.553,0,1,0.447,1,1S49.553,44,49,44z"></path></g><g><path fill="#8d6c9f" d="M43.605,23.032c-0.493,0-0.922-0.364-0.99-0.866c-0.124-0.924-0.35-1.778-0.67-2.537 c-0.215-0.509,0.023-1.095,0.532-1.31c0.507-0.215,1.095,0.023,1.31,0.533c0.39,0.922,0.662,1.947,0.811,3.047 c0.073,0.547-0.311,1.051-0.857,1.125C43.694,23.029,43.649,23.032,43.605,23.032z"></path><path fill="#8d6c9f" d="M40.258,16.836c-0.212,0-0.426-0.067-0.606-0.206c-2.152-1.647-4.712-1.704-4.737-1.705 c-0.551-0.008-0.993-0.461-0.986-1.012c0.006-0.551,0.43-0.999,1.007-0.988c0.131,0.001,3.234,0.051,5.932,2.117 c0.439,0.335,0.522,0.963,0.187,1.402C40.856,16.701,40.559,16.836,40.258,16.836z"></path></g>
</svg>
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
              {notifications.length}
            </span>
          )}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md overflow-hidden z-20">
            <div className="px-4 py-2 border-b font-medium">Notifications</div>
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500">No new notifications</div>
            ) : (
              notifications.map(note => (
                <a
                  key={note.id}
                  href={note.data.url}
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {note.message}
                </a>
              ))
            )}
          </div>
        )}
      </div>

      {user && <div className="ml-6 text-gray-700">Hello, {localStorage.getItem("name")}</div>}
    </header>
  );
}
