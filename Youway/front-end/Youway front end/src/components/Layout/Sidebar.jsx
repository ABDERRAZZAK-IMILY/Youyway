import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  {
    name: 'Home',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l9-9 9 9m-9-3v12"
        />
      </svg>
    ),
    to: '/dashboard',
  },
  {
    name: 'Sessions',
    svg: (
      <svg  className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" id="_24x24_On_Light_Session-Join" data-name="24x24/On Light/Session-Join" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect id="view-box" width="24" height="24" fill="none"></rect> <path id="Shape" d="M5.75,17.5a.75.75,0,0,1,0-1.5h8.8A1.363,1.363,0,0,0,16,14.75v-12A1.363,1.363,0,0,0,14.55,1.5H5.75a.75.75,0,0,1,0-1.5h8.8A2.853,2.853,0,0,1,17.5,2.75v12A2.853,2.853,0,0,1,14.55,17.5ZM7.22,13.28a.75.75,0,0,1,0-1.061L9.939,9.5H.75A.75.75,0,0,1,.75,8H9.94L7.22,5.28A.75.75,0,0,1,8.28,4.22l4,4,.013.013.005.006.007.008.007.008,0,.005.008.009,0,0,.008.01,0,0,.008.011,0,0,.008.011,0,0,.008.011,0,0,.007.011,0,.005.006.01,0,.007,0,.008,0,.009,0,.006.006.011,0,0,.008.015h0a.751.751,0,0,1-.157.878L8.28,13.28a.75.75,0,0,1-1.06,0Z" transform="translate(3.25 3.25)" fill="#141124"></path> </g></svg>
    ),
    to: '/sessions',
  },
  {
    name: 'Users',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    to: '/users',
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const sidebarClasses = `h-screen bg-blue-500 border-r transition-all duration-300 ${
    isOpen ? 'w-64' : 'w-16'
  }`;

  return (
    <div className={sidebarClasses}>
      <div className="flex items-center justify-between p-4">
        {isOpen && <h1 className="text-xl font-bold">Youyway</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {isOpen ? (
            <span className="block text-2xl leading-none">&times;</span> 
          ) : (
            <span className="block text-2xl leading-none">&#9776;</span> 
          )}
        </button>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className="flex items-center p-2 rounded hover:bg-gray-100 transition-colors"
          >
            {item.svg}
            {isOpen && <span className="ml-3 text-gray-800">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
