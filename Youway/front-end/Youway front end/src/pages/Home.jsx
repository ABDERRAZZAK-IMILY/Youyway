import React from 'react';
import { Link } from 'react-router-dom';
import heroimg from "/src/assets/placeholder.png";

import smilingstudent from '/src/assets/technology 1.png';
import tv from '/src/assets/tvhome.svg';
import hwjala from '/src/assets/hawjala.svg';
import telescope from '/src/assets/telescope.png';
import Footer  from '/src/Layouts/Footer';
import imily from '/src/assets/imily.png';

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
              <img src={tv} alt="tv icon" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Certified Mentors</h3>
            <div className="w-12 h-1 bg-red-500 mb-4"></div>
            <p className="text-gray-600">
              The gradual accumulation of information about atomic and small-scale behaviour...
            </p>
          </div>

          <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <img src={telescope} alt="Telescope icon" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">approve your creare</h3>
            <div className="w-12 h-1 bg-red-500 mb-4"></div>
            <p className="text-gray-600">
              The gradual accumulation of information about atomic and small-scale behaviour...
            </p>
          </div>

          <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <img src={hwjala} alt="hawjala icon" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">2,769 sessions</h3>
            <div className="w-12 h-1 bg-red-500 mb-4"></div>
            <p className="text-gray-600">
            "Refining atomic knowledge enhances scientific understanding and analysis."
            </p>
          </div>
   

      </div>


   {/* Section 3 */}
      <div className="min-h-screen bg-white flex items-center justify-center py-16 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="relative w-full md:w-1/2">
          <div className="relative bg-blue-50 rounded-3xl p-4 max-w-md mx-auto">
            <img 
              src={smilingstudent} 
              alt="Smiling student" 
              className="w-full h-auto object-cover rounded-2xl"
            />
            </div>
        </div>
        
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="mx-auto md:mx-0 md:max-w-md">
            <div className="w-24 h-1 bg-red-500 mx-auto md:mx-0 mb-6"></div>
            <h2 className="text-5xl font-bold text-slate-800 mb-6">Find a Mentor</h2>
            <p className="text-gray-500 mb-8">search for the metore</p>
            <button className="text-green-500 hover:text-green-600 font-medium flex items-center mx-auto md:mx-0">
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header section */}
        <div className="mb-16">
          <p className="text-green-500 font-medium mb-2">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Our team</h2>
          <p className="text-gray-500 max-w-2xl">
            Problems trying to resolve the promblme of orientaion in morrocco
          </p>
        </div>
        

        {/* our team  */}
        <div className="flex flex-col items-center max-w-md mx-auto text-center">
          <div className="mb-6">
            <img 
              src={imily}
              alt="abderrazzak imily" 
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          
          <p className="text-gray-600 mb-6">
            1 years of experience in the field of web development, specializing in front-end technologies.
            Proficient in HTML, CSS, and JavaScript, with a strong understanding of responsive design principles. 
            Passionate about creating user-friendly interfaces and optimizing web performance.
            Excellent problem-solving skills and a keen eye for detail.
          </p>
          
          <div className="flex mb-4">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 mb-1">IMILY ABDERRAZZAK</h3>
          <p className="text-gray-500">WEB DEVELOPPER</p>
        </div>
      </div>
    </div>


    <Footer />
  </div>
  );
}