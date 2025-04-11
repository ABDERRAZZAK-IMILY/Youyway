
import { Outlet , Link } from "react-router-dom";

export default function Layout({ children }) {



    return (
        <div className="flex flex-col justify-center items-center h-screen bg-red-100">
            <header className="text-3xl font-bold text-center text-blue-500">
             <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
                    <div className="flex space-x-4">
                        <a href="/" className="hover:text-gray-300">Home</a>
                        <a href="/about" className="hover:text-gray-300">About</a>
                        <a href="/contact" className="hover:text-gray-300">Contact</a>
                    </div>
                    <div className="flex space-x-4">
                        <a href="/login" className="hover:text-gray-300">Login</a>
                        <a href="/register" className="hover:text-gray-300">Register</a>
                    </div>
             </nav>


                </header>
                <Outlet />
        </div>
    )



}
