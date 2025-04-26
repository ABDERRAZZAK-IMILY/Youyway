import React, { useState } from 'react';
import { Link } from 'react-router-dom';



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
   
          <Link
         
         
            className="flex items-center p-2 rounded hover:bg-gray-100 transition-colors"
          >
       
            {isOpen && <span className="ml-3 text-gray-800"></span>}
          </Link>
      
      </nav>
    </div>
  );
}
