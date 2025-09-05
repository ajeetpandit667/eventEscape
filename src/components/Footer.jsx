import React from 'react';
import { Calendar, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-indigo-400 mr-2" />
              <span className="text-xl font-bold">EventEase</span>
            </div>
            <p className="text-gray-400 mb-6">Bring your community to life — one event at a time.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Discover Events</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Host an Event</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">My Events</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Hosting Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Community Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Safety Tips</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}


