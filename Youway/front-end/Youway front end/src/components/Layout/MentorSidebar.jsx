import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import { FaUser, FaChalkboardTeacher, FaSignOutAlt } from 'react-icons/fa';

const menuItems = [
  {
    name: 'Home',
    icon: <AiFillHome size={20} />,
    to: '/mentordashboard',
  },
  {
    name: 'Manage Sessions',
    icon: <MdOutlineMeetingRoom size={20} />,
    to: '/SessionMange',
  },
  {
    name: 'Profile',
    icon: <FaUser size={20} />,
    to: '/mentor-profile',
  },
  {
    name: 'Availability',
    icon: <BsFillPeopleFill size={20} />,
    to: '/mentor-availability',
  }
];

export default function MentorSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const userName = localStorage.getItem('userName') || 'Mentor';

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  return (
    <div className={`h-screen bg-green-500 border-r shadow-sm transition-all duration-300 flex flex-col ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
     
      <div className="flex items-center justify-between p-5 border-b">
        {isOpen && <h1 className="text-xl font-bold text-white">YouWay</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          {isOpen ? (
            <FiChevronLeft size={20} className="text-gray-200" />
          ) : (
            <FiChevronRight size={20} className="text-gray-200" />
          )}
        </button>
      </div>

      <nav className="mt-6 flex-1">
        <div className="space-y-2 px-3">
          {menuItems.map((item) => {
            const active = isActive(item.to);
            
            return (
              <Link
                key={item.name}
                to={item.to}
                className={`flex items-center ${
                  isOpen ? 'px-4' : 'justify-center'
                } py-3 rounded-lg transition-colors ${
                  active 
                    ? 'bg-green-600 text-white' 
                    : 'text-white hover:bg-green-400 hover:text-white'
                }`}
              >
                <div className={active ? 'text-white' : 'text-green-100'}>
                  {item.icon}
                </div>
                {isOpen && (
                  <span className={`ml-3 font-medium ${active ? 'text-white' : 'text-green-100'}`}>
                    {item.name}
                  </span>
                )}
                {active && isOpen && (
                  <div className="ml-auto w-1.5 h-5 rounded-full bg-white"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 mt-auto">
        {isOpen && (
          <div className="flex items-center bg-green-600 p-3 rounded-lg text-white">
            <FaChalkboardTeacher size={20} />
            <span className="ml-3 text-sm font-medium">Mentor Portal</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center mt-4 p-3 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors w-full ${
            isOpen ? '' : 'justify-center'
          }`}
        >
          <FaSignOutAlt size={20} />
          {isOpen && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
