import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdOutlineMeetingRoom } from 'react-icons/md';

const menuItems = [
  {
    name: 'Home',
    icon: <AiFillHome size={20} />,
    to: '/dashboard',
  },
  {
    name: 'Mange Sessions',
    icon: <MdOutlineMeetingRoom size={20} />,
    to: '/SessionMange',
  },
  {
    name: 'Users',
    icon: <BsFillPeopleFill size={20} />,
    to: '/users',
  },
  {
    name : 'Create Session',
    icon: <BsFillPeopleFill size={20} />,
    to : '/createsession'
  }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`h-screen bg-green-500 border-r shadow-sm transition-all duration-300 flex flex-col ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
     
      <div className="flex items-center justify-between p-5 border-b">
        {isOpen && <h1 className="text-xl font-bold text-white">Youyway</h1>}
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
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={active ? 'text-indigo-600' : 'text-gray-500'}>
                  {item.icon}
                </div>
                {isOpen && (
                  <span className={`ml-3 font-medium ${active ? 'text-indigo-600' : ''}`}>
                    {item.name}
                  </span>
                )}
                {active && isOpen && (
                  <div className="ml-auto w-1.5 h-5 rounded-full bg-indigo-600"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

     
    </div>
  );
}