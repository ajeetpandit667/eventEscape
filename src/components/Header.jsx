import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border-b shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
              <Calendar className="h-6 w-6 text-white" />
            </span>
            <span className="text-2xl font-bold text-gray-900 tracking-tight transition-colors duration-300">EventEase</span>
          </div>
          <nav className="flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-700 px-3 py-2 text-base font-semibold rounded transition-colors duration-200">Home</Link>
            <Link to="/discover" className="text-gray-600 hover:text-indigo-700 px-3 py-2 text-base font-semibold rounded transition-colors duration-200">Discover</Link>
            <Link to="/my-events" className="text-gray-600 hover:text-indigo-700 px-3 py-2 text-base font-semibold rounded transition-colors duration-200">My Events</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/user-login">
              <button className="text-gray-700 hover:text-indigo-700 font-medium transition-colors duration-200">Login</button>
            </Link>
            <Link to="/user-SignUp">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition-all duration-200">Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}


