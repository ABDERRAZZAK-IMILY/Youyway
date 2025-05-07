import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';                               
import { axiosClient } from '../../api/axios';                        
import Echo from 'laravel-echo';                                     
import Pusher from 'pusher-js';
import { IoIosNotifications } from "react-icons/io";

window.Pusher = Pusher;

export default function Header() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef();
  
  const markAsRead = (notificationId) => {
    axiosClient.patch(`/notifications/read`, { id: notificationId })
      .then(() => {
        setNotifications(prevNotes => 
          prevNotes.map(note => 
            note.id === notificationId ? { ...note, read_at: new Date().toISOString() } : note
          )
        );
      })
      .catch(err => {
        console.error('Error marking notification as read:', err);
        setNotifications(prevNotes => 
          prevNotes.map(note => 
            note.id === notificationId ? { ...note, read_at: new Date().toISOString() } : note
          )
        );
      });
  };
  
  const markAllAsRead = () => {
    axiosClient.patch(`/notifications/read`)
      .then(() => {
        setNotifications(prevNotes => 
          prevNotes.map(note => ({ ...note, read_at: new Date().toISOString() }))
        );
      })
      .catch(err => {
        console.error('Error marking all notifications as read:', err);
        setNotifications(prevNotes => 
          prevNotes.map(note => ({ ...note, read_at: new Date().toISOString() }))
        );
      });
  };

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

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      
      console.log('Fetching notifications for user:', userData.id || 'unknown');
      
      axiosClient
        .get('/notifications')
        .then(res => {
          console.log('Notifications received:', res.data);
          const notificationData = Array.isArray(res.data) ? res.data : (res.data.data || []);
          console.log('Parsed notification data:', notificationData);
          setNotifications(notificationData);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching notifications:', err);
          
          if (err.response && err.response.status === 401) {
            console.log('Authentication error when fetching notifications, refreshing token...');
          }
          
          setNotifications([]);
          setLoading(false);
        });

      if (token && userData?.id) {
        try {
          const echo = new Echo({
            broadcaster: 'pusher',
            key: '14093af63cb0b67fb854',
            cluster: 'eu',
            forceTLS: true,
            authEndpoint: "/api/broadcasting/auth", 
            auth: {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
              }
            },
            withCredentials: false 
          });
          
          const userChannel = echo.private(`App.Models.User.${userData.id}`);
          console.log('Listening for notifications on channel:', `App.Models.User.${userData.id}`);
          
          const legacyChannel = echo.private(`notifications.${userData.id}`);
          console.log('Also listening on legacy channel:', `notifications.${userData.id}`);
          
          userChannel.notification((notification) => {
            console.log('Real-time notification received via WebSocket:', notification);
            console.log('Current notifications before update:', notifications);
            
            setNotifications(prev => {
              console.log('Previous notifications in state update:', prev);
              return [notification, ...prev];
            });
          });
          
          legacyChannel.listen('NewNotification', (event) => {
            console.log('Notification received on legacy channel:', event);
            if (event && event.notification) {
              setNotifications(prev => [event.notification, ...prev]);
            }
          });
          
          return () => {
            console.log('Cleaning up notification listeners');
            echo.leave(`App.Models.User.${userData.id}`);
            echo.leave(`notifications.${userData.id}`);
          };
        } catch (err) {
          console.error('Error setting up Echo listener:', err);
        }
      }
    } catch (error) {
      console.error('Error in notification setup:', error);
    }
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
          <div className="relative">
            <IoIosNotifications size={40} className="text-white hover:text-gray-200" />
            {notifications.filter(n => !n.read_at).length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                {notifications.filter(n => !n.read_at).length}
              </span>
            )}
          </div>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-md overflow-hidden z-20">
            <div className="px-4 py-3 border-b font-medium bg-gray-50 flex justify-between items-center">
              <span>Notifications</span>
              {notifications.filter(n => !n.read_at).length > 0 && (
                <button 
                  onClick={() => markAllAsRead()}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
            {loading ? (
              <div className="p-4 text-gray-500 text-center">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">No notifications</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((note) => {
                  const getIcon = () => {
                    switch (note.type.split('\\').pop()) {
                      case 'SessionAcceptedNotification': return '✅';
                      case 'SessionRejectedNotification': return '❌';
                      case 'SessionScheduledNotification': return '📅';
                      case 'SessionCompletedNotification': return '🎓';
                      default: return '📣';
                    }
                  };
                  
                  const noteData = typeof note.data === 'string' ? JSON.parse(note.data) : note.data;
                  const message = noteData?.message || 'Session status updated';
                  const title = noteData?.title || 'Session Update';
                  const callLink = noteData?.call_link || null;
                  
                  return (
                    <div
                      key={note.id}
                      className={`border-b last:border-0 px-4 py-3 ${!note.read_at ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className="text-xl">{getIcon()}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">
                            {title}
                          </div>
                          <p className="text-sm text-gray-600">{message}</p>
                          {callLink && (
                            <div className="mt-2">
                              <a 
                                href={callLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded inline-flex items-center"
                              >
                                <span className="mr-1">Join Meeting</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                              </a>
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(note.created_at).toLocaleString()}
                            </span>
                            {!note.read_at && (
                              <button
                                onClick={() => markAsRead(note.id)}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </header>
  );
}
