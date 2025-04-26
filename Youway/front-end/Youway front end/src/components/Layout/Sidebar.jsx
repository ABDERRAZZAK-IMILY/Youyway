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
          d="M15 10l4.553-2.276A2 2 0 0122 9.618v4.764a2 2 0 01-2.447 1.894L15 14m-6 0l-4.553 2.276A2 2 0 012 14.382V9.618a2 2 0 012.447-1.894L9 10m6 0v4m-6-4v4"
        />
      </svg>
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
