import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Plus, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white p-6 shadow-sm min-h-screen border-r">
      <h2 className="text-lg font-bold mb-6">Event Dashboard</h2>
      <nav className="space-y-3">
        <Link to="/my-events" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-2 px-3 rounded hover:bg-blue-50 transition-colors">
          <Eye className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        <Link to="/host" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-2 px-3 rounded hover:bg-blue-50 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Host New Event</span>
        </Link>
        <Link to="/profile-settings" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-2 px-3 rounded hover:bg-blue-50 transition-colors">
          <Settings className="w-4 h-4" />
          <span>Profile Settings</span>
        </Link>
        <button className="flex items-center gap-2 text-red-500 hover:text-red-700 py-2 px-3 rounded hover:bg-red-50 transition-colors w-full text-left">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
