import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaCalendarAlt, 
  FaChartBar, 
  FaUserShield, 
  FaCog, 
  FaSignOutAlt 
} from 'react-icons/fa';
import logo from '../../assets/logo.png';

const AdminSidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const userName = localStorage.getItem('userName') || 'Administrator';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const menuItems = [
    { path: '/admin-dashboard', name: 'Dashboard', icon: <FaHome /> },
    { path: '/admin-users', name: 'User Management', icon: <FaUsers /> },
    { path: '/admin-sessions', name: 'Session Management', icon: <FaCalendarAlt /> },
    { path: '/admin-settings', name: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white w-64 fixed">
      <div className="p-5 border-b border-gray-800 flex justify-center">
        <Link to="/admin-dashboard" className="flex items-center justify-center">
          <img src={logo} alt="YouWay Logo" className="h-10" />
          <span className="text-xl font-bold ml-2">YouWay Admin</span>
        </Link>
      </div>

      <div className="flex-grow overflow-y-auto py-4">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg ${
                  path === item.path ? 'bg-indigo-700' : 'hover:bg-gray-800'
                } transition-colors`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center mb-4">
          <div className="bg-indigo-600 p-2 rounded-full">
            <FaUserShield />
          </div>
          <div className="ml-3">
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
