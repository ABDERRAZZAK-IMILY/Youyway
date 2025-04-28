
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

    <div className="flex items-center space-x-6">
      {user && (
        <div className="flex items-center text-gray-700">
          <span>Hello, {localStorage.getItem("name")}</span>

          {notifications.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
      )}

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="relative focus:outline-none"
        >
          <svg
            fill="#000000"
            height="20px"
            width="20px"
            version="1.1"
            id="Icons"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            xmlSpace="preserve"
          >
            <g>
              <path d="M26.8,25H5.2c-0.8,0-1.5-0.4-1.9-1.1c-0.4-0.7-0.3-1.5,0.1-2.2L4.5,20c1.8-2.7,2.7-5.8,2.7-9c0-3.7,2.4-7.1,5.9-8.3C13.7,1.6,14.8,1,16,1s2.3,0.6,2.9,1.7c3.5,1.2,5.9,4.6,5.9,8.3c0,3.2,0.9,6.3,2.7,9l1.1,1.7c0.4,0.7,0.5,1.5,0.1,2.2C28.4,24.6,27.6,25,26.8,25z" />
            </g>
            <path d="M11.1,27c0.5,2.3,2.5,4,4.9,4s4.4-1.7,4.9-4H11.1z" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md overflow-hidden z-20">
            <div className="px-4 py-2 border-b font-medium">Notifications</div>
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500">No new notifications</div>
            ) : (
              notifications.map((note) => (
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
    </div>
  </header>
  );
}
