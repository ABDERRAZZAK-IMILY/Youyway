import React from 'react';
import { Link } from 'react-router-dom';
import heroimg from '../assets/placeholder.png';


export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="pt-8 pb-12 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row">
          <div className="md:w-1/2 pt-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              25K+ STUDENTS<br />TRUST US
            </h1>
            <p className="text-gray-600 mb-8">
              Our goal is to make the best way for everyone!
            </p>
            <div className="flex space-x-4">
              <button className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition-colors duration-200">
                Get Started Now
              </button>
              <button className="border border-gray-300 px-6 py-3 rounded text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 relative">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow-100 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-blue-400 opacity-40"></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-green-200 opacity-60"></div>
            <img 
              src={heroimg}
              alt="Happy student with books" 
              className="relative z-10 mx-auto"
            />
          </div>
        </div>
      </section>  


          {/*  Section 2 */}
        <div className="flex px-8 py-12 gap-4">
          <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <img src="" alt="Computer icon" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Certified Mentors</h3>
            <div className="w-12 h-1 bg-red-500 mb-4"></div>
            <p className="text-gray-600">
              The gradual accumulation of information about atomic and small-scale behaviour...
            </p>
          </div>

          <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <img src="" alt="Telescope icon" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">approve your creare</h3>
            <div className="w-12 h-1 bg-red-500 mb-4"></div>
            <p className="text-gray-600">
              The gradual accumulation of information about atomic and small-scale behaviour...
            </p>
          </div>

          <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <img src="" alt="Lab flask icon" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">2,769 online courses</h3>
            <div className="w-12 h-1 bg-red-500 mb-4"></div>
            <p className="text-gray-600">
              The gradual accumulation of information about atomic and small-scale behaviour...
            </p>
          </div>
   

      </div>
    </div>
  );
}