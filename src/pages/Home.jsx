import React from 'react';
import { Calendar, Users, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EventEaseLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Find or Host Events<br />
                Happening Around You
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Discover flea markets, book clubs, tech meetups, and more — all within your community.
              </p>
              <div className="flex space-x-4">
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700">
                  Browse Events Near Me
                </button>
                <Link to="/host">
                  <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50">
                    Host an Event
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Right map */}
            <div className="relative">
              <div className="bg-gray-300 rounded-lg h-96 relative overflow-hidden">
                {/* Map background with street patterns */}
                <div className="absolute inset-0 opacity-30">
                  <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                      <pattern id="streets" patternUnits="userSpaceOnUse" width="40" height="40">
                        <path d="M 0,20 40,20 M 20,0 20,40" stroke="white" strokeWidth="1" opacity="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#streets)" />
                  </svg>
                </div>
                
                {/* Map pins */}
                <MapPin className="absolute top-12 left-20 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-16 right-24 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-24 left-32 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-32 right-20 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-36 left-24 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-40 right-32 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-48 left-40 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-52 right-16 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-56 left-28 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-60 right-28 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-64 left-36 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-68 right-24 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-72 left-32 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-76 right-20 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute top-80 left-44 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute bottom-16 right-36 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute bottom-20 left-20 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute bottom-24 right-40 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute bottom-28 left-48 h-6 w-6 text-orange-500 fill-current" />
                <MapPin className="absolute bottom-32 right-44 h-6 w-6 text-orange-500 fill-current" />
                
                {/* Curved road/river */}
                <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 400 400">
                  <path 
                    d="M 0,350 Q 100,320 200,340 T 400,360" 
                    stroke="white" 
                    strokeWidth="8" 
                    fill="none" 
                    opacity="0.6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            How EventEase Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Discover</h3>
              <p className="text-gray-600">
                Browse events on a map and find what's happening near you.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">RSVP</h3>
              <p className="text-gray-600">
                Reserve your spot and save events to your calendar.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Host</h3>
              <p className="text-gray-600">
                Organize your own event and invite the community.
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Review</h3>
              <p className="text-gray-600">
                Share your experience and help the community grow.
              </p>
            </div>
          </div>
          

        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
              See All Events
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Event 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Urban Garden Workshop" 
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  Workshop
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Urban Garden Workshop</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>July 20, 10:00 AM</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Sector 12 Park</span>
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">
                  RSVP Now
                </button>
              </div>
            </div>

            {/* Event 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Community Drum Circle" 
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  Music
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Drum Circle</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>July 25, 6:00 PM</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Civic Center Amphitheater</span>
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">
                  RSVP Now
                </button>
              </div>
            </div>

            {/* Event 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Fiction Writers Meetup" 
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-4 right-4 bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  Meetup
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fiction Writers Meetup</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>July 23, 4:00 PM</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Brew & Beans Cafe</span>
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700">
                  RSVP Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            What Our Community Says
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                  alt="Sarah Johnson" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Book Lover</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I discovered the best local book club on EventEase! Now I have a new hobby and amazing friends."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Michael Torres" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Michael Torres</h4>
                  <p className="text-sm text-gray-600">Photographer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Hosting my photography workshop was so easy. The platform helped me connect with people who share my passion."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80" 
                  alt="Priya Sharma" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Priya Sharma</h4>
                  <p className="text-sm text-gray-600">Software Developer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "EventEase helped me find local tech meetups when I moved to a new city. I've made valuable connections and friends!"
              </p>
            </div>
          </div>


        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Got an Idea for a Local Event?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Bring your neighborhood together — plan something amazing and watch your community thrive.
          </p>
          <Link to="/host">
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Host Your First Event
            </button>
            </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}