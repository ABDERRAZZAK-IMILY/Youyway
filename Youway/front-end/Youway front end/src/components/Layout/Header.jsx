
import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';                               
import { axiosClient } from '../../api/axios';                        
import Echo from 'laravel-echo';                                     
import Pusher from 'pusher-js';
import { IoIosNotifications } from "react-icons/io";

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
    <header className="flex items-center justify-between bg-green-500  p-4 border-b">
    <div className="text-4xl font-semibold">Youyway</div>

    <div className="flex items-center space-x-6">
      {user && (
        <div className="flex items-center text-white">
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
       <IoIosNotifications size={40} />
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
