import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Star,
  Search,
  Filter,
  Settings,
  LogOut
} from 'lucide-react';

const EventCard = ({ event, onEdit, onDelete, onView, isHosted = true }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    {event.cover_image ? (
      <img
        src={event.cover_image.startsWith('http') ? event.cover_image : `http://127.0.0.1:8000${event.cover_image}`}
        alt={event.title}
        className="h-32 w-full object-cover rounded mb-3"
      />
    ) : (
      <div className="h-32 bg-gray-300 mb-3 rounded flex items-center justify-center">
        <span className="text-gray-600 text-sm">No Image</span>
      </div>
    )}
    
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
        {event.category?.name || 'Uncategorized'}
      </span>
    </div>
    
    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
      <CalendarDays className="w-4 h-4" />
      {new Date(event.start_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })}
    </p>
    
    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
      <MapPin className="w-4 h-4" />
      {event.location}
    </p>
    
    <div className="flex justify-between items-center mb-3">
      <p className="text-sm text-gray-600 flex items-center gap-1">
        <Users className="w-4 h-4" />
        {event.rsvp_count || 0} RSVPs
      </p>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500" />
        <span className="text-sm">{event.average_rating || 0}</span>
      </div>
    </div>
    
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-semibold">
        {event.is_free ? 'Free' : `$${event.price}`}
      </span>
      <span className={`text-xs px-2 py-1 rounded ${
        event.status === 'published' ? 'bg-green-100 text-green-800' :
        event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {event.status}
      </span>
    </div>
    
    {isHosted ? (
      <div className="flex space-x-2">
        <button 
          onClick={() => onView(event)}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button 
          onClick={() => onEdit(event)}
          className="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition-colors flex items-center justify-center gap-1"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button 
          onClick={() => onDelete(event)}
          className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    ) : (
      <div className="flex space-x-2">
        <button 
          onClick={() => onView(event)}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
        <button 
          className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Cancel RSVP
        </button>
      </div>
    )}
  </div>
);

export default function MyEventsDashboard() {
  const [activeTab, setActiveTab] = useState("hosted");
  const [hostedEvents, setHostedEvents] = useState([]);
  const [rsvpdEvents, setRsvpdEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Fetch hosted events
  const fetchHostedEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/events/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setHostedEvents(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching hosted events:', error);
    }
  };

  // Fetch RSVP'd events
  const fetchRsvpdEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/rsvps/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Extract event details from RSVPs
        const events = data.results || data;
        setRsvpdEvents(events.map(rsvp => rsvp.event));
      }
    } catch (error) {
      console.error('Error fetching RSVP\'d events:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchHostedEvents(), fetchRsvpdEvents()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle event edit
  const handleEdit = (event) => {
    // Navigate to edit page or open edit modal
    console.log('Edit event:', event);
    // You can implement navigation to edit page here
    // navigate(`/edit-event/${event.id}`);
  };

  // Handle event delete
  const handleDelete = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/events/${eventToDelete.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove from local state
        setHostedEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
        setShowDeleteModal(false);
        setEventToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Handle event view
  const handleView = (event) => {
    console.log('View event:', event);
    // Navigate to event details page
    // navigate(`/event/${event.id}`);
  };

  // Filter events based on search and filters
  const getFilteredEvents = () => {
    const events = activeTab === "hosted" ? hostedEvents : rsvpdEvents;
    
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || event.category?.id == selectedCategory;
      const matchesStatus = !selectedStatus || event.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b p-4 flex items-center justify-between h-20 shadow-sm">
        <h1 className="text-xl font-bold">EventEase</h1>
        <nav className="flex space-x-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-bold">Home</Link>
          <Link to="/discover" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-bold">Discover</Link>
          <Link to="/my-events" className="text-blue-600 px-3 py-2 text-sm font-bold">My Events</Link>
        </nav>
        <div className="w-8 h-8 rounded-full bg-black"></div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 shadow-sm min-h-screen">
          <h2 className="text-lg font-semibold mb-6">Event Dashboard</h2>
          <nav className="space-y-3">
            <Link to="/my-events" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-2 px-3 rounded hover:bg-blue-50">
              <Eye className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/host" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-2 px-3 rounded hover:bg-blue-50">
              <Plus className="w-4 h-4" />
              Host New Event
            </Link>
            <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 py-2 px-3 rounded hover:bg-blue-50">
              <Settings className="w-4 h-4" />
              Profile Settings
            </a>
            <a href="#" className="flex items-center gap-2 text-red-500 hover:text-red-700 py-2 px-3 rounded hover:bg-red-50">
              <LogOut className="w-4 h-4" />
              Logout
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Tab Buttons */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("hosted")}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === "hosted" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Hosted Events ({hostedEvents.length})
              </button>
              <button
                onClick={() => setActiveTab("rsvpd")}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === "rsvpd" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                RSVP'd Events ({rsvpdEvents.length})
              </button>
            </div>

            {/* Events Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">
                  {activeTab === "hosted" ? "No hosted events found." : "No RSVP'd events found."}
                </p>
                <p className="text-gray-400 text-sm">
                  {activeTab === "hosted" 
                    ? "Start hosting events to see them here." 
                    : "RSVP to events to see them here."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    isHosted={activeTab === "hosted"}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
