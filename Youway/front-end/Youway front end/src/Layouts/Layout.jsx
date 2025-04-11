import { Link, Outlet } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen h-screen w-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            YOUway
          </h1>
          <nav className="flex items-center">
            <ul className="flex space-x-8">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
              </li>
              <li>
                <Link to="/mentors" className="text-gray-600 hover:text-gray-800">Mentors</Link>
              </li>
            </ul>
            <div className="ml-8 flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
              <Link to="/Regester" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors duration-200 flex items-center">
                JOIN US
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}