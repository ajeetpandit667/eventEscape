import React, { useState, useEffect } from 'react';
import { MapPin, CalendarDays, Star, PlusCircle, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import MapComponent from '../components/MapComponent';

const EventCard = ({ title, date, location, rsvps, rating, category, price, is_free, coverImage, coordinates, onShowLocation, isSelected }) => (
  <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
    isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
  }`}>
    {coverImage ? (
      <img
        src={coverImage.startsWith('http') ? coverImage : `http://127.0.0.1:8000${coverImage}`}
        alt={title}
        className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
      />
    ) : (
      <div className="h-48 bg-gray-300 flex items-center justify-center text-sm text-gray-600">
        No Image
      </div>
    )}
    <div className="p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">{title}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex-shrink-0">{category}</span>
      </div>
      <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
        <CalendarDays className="w-4 h-4 flex-shrink-0" /> 
        <span className="truncate">{date}</span>
      </p>
      <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
        <MapPin className="w-4 h-4 flex-shrink-0" /> 
        <span className="truncate">{location}</span>
      </p>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          {rsvps} RSVPs <Star className="w-4 h-4 ml-1" /> {rating}
        </p>
        <span className="text-sm font-semibold text-green-600">
          {is_free ? 'Free' : `$${price}`}
        </span>
      </div>
      <div className="flex gap-2">
  <button 
    onClick={() => onShowLocation(coordinates)}
    className={`flex-1 py-1 px-2 rounded transition-all duration-200 font-medium text-xs flex items-center justify-center gap-1 shadow-sm hover:shadow-md ${
      isSelected 
        ? 'bg-blue-700 text-white cursor-default' 
        : coordinates && coordinates.length === 2
          ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
    }`}
    title={
      isSelected 
        ? "Currently viewing this location" 
        : coordinates && coordinates.length === 2
          ? "Center map on this event's location"
          : "Location coordinates not available"
    }
    disabled={isSelected || !coordinates || coordinates.length !== 2}
  >
    <MapPin className="w-4 h-4" />
    {isSelected ? 'Viewing' : coordinates && coordinates.length === 2 ? 'Show Location' : 'No Location'}
  </button>

  <button className="flex-1 bg-black text-white py-1 px-2 rounded text-xs hover:bg-gray-800 active:bg-gray-900 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
    RSVP
  </button>
</div>

    </div>
  </div>
);

export default function DiscoverPage() {
  const [mapCoordinates, setMapCoordinates] = useState([40.7128, -74.006]); // Default to NYC
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [mapTransitioning, setMapTransitioning] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showLocationSuccess, setShowLocationSuccess] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
      setCategories(data.results || data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  // Fetch events from Django API
  const fetchEvents = (filters = {}) => {
    setLoading(true);
    const params = new URLSearchParams();
    
    // Add filters to params
    if (filters.lat && filters.lng) {
      params.append('lat', filters.lat);
      params.append('lng', filters.lng);
      params.append('radius', '10'); // 10km radius
    }
    if (filters.category) {
      params.append('category', filters.category);
    }
    if (filters.date) {
      params.append('date', filters.date);
    }
    if (filters.ordering) {
      params.append('ordering', filters.ordering);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const url = `http://127.0.0.1:8000/api/events/${params.toString() ? '?' + params.toString() : ''}`;
    
    console.log('Fetching events with URL:', url);
    
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data);
        setEvents(data.results || data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  };

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle search location
  const handleLocationSearch = (coords) => {
    setMapCoordinates(coords);
    fetchEvents({
      lat: coords[0],
      lng: coords[1],
      category: selectedCategory,
      date: selectedDate,
      ordering: sortBy,
      search: searchLocation
    });
  };

  // Handle search query
  const handleSearchQuery = (query) => {
    setSearchLocation(query);
  };

  // Handle filter application
  const handleApplyFilters = () => {
    const filters = {};
    
    if (searchLocation) filters.search = searchLocation;
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedDate) filters.date = selectedDate;
    if (sortBy) filters.ordering = sortBy;
    
    // Add location filter if we have coordinates
    if (mapCoordinates && mapCoordinates[0] !== 40.7128) {
      filters.lat = mapCoordinates[0];
      filters.lng = mapCoordinates[1];
    }
    
    fetchEvents(filters);
    setFiltersApplied(true);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setSearchLocation('');
    setSelectedCategory('');
    setSelectedDate('');
    setPriceFilter('all');
    setSortBy('date');
    setMapCoordinates([40.7128, -74.006]);
    setFiltersApplied(false);
    fetchEvents();
  };

  // Handle showing event location on map
  const handleShowLocation = (coordinates, event) => {
    if (coordinates && coordinates.length === 2) {
      setMapTransitioning(true);
      setMapCoordinates(coordinates);
      setSelectedEvent(event);
      
      // Smooth scroll to events section to show the selected event
      setTimeout(() => {
        const eventsSection = document.querySelector('.bg-gray-50');
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      
      // Add a small delay to ensure smooth map transition
      setTimeout(() => {
        setMapTransitioning(false);
        setShowLocationSuccess(true);
        console.log('Map centered on event location:', coordinates);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowLocationSuccess(false);
        }, 3000);
      }, 500);
    } else {
      console.warn('Invalid coordinates for event:', coordinates);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Filter events by price
  const filteredEvents = events.filter(event => {
    if (priceFilter === 'free') return event.is_free;
    if (priceFilter === 'paid') return !event.is_free;
    return true; // 'all' filter
  });

  return (
  <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Success Notification */}
      {showLocationSuccess && (
        <div className="fixed top-24 right-6 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-in slide-in-from-right-5">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Location displayed on map!</span>
          </div>
        </div>
      )}

      {/* Header - Unified Style */}
      <header className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border-b shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
                <MapPin className="h-6 w-6 text-white" />
              </span>
              <span className="text-2xl font-bold text-gray-900 tracking-tight transition-colors duration-300">EventEase</span>
            </div>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-indigo-700 px-3 py-2 text-base font-semibold rounded transition-colors duration-200">Home</Link>
              <Link to="/discover" className="text-indigo-600 px-3 py-2 text-base font-semibold rounded transition-colors duration-200">Discover</Link>
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
      
      {/* Search and Filters */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="max-w-7xl mx-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 items-end" onSubmit={e => {e.preventDefault(); handleApplyFilters();}}>
            {/* Location Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Search className="w-4 h-4 inline mr-1" />
                Search Location
              </label>
              <SearchBox onResult={handleLocationSearch} onSearchQuery={handleSearchQuery} />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select 
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input 
                type="date" 
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <select 
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="free">Free Only</option>
                <option value="paid">Paid Only</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select 
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date</option>
                <option value="rating">Rating</option>
                <option value="title">Title</option>
                <option value="created_at">Recently Added</option>
              </select>
            </div>

            {/* Apply Filters Button - Aligned with Search */}
            <div className="flex gap-2 lg:col-span-1">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2 w-full"
              >
                <Filter className="w-4 h-4" />
                Apply Filters
              </button>
              {filtersApplied && (
                <button 
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors w-full"
                >
                  Reset
                </button>
              )}
            </div>
          </form>

          {/* Active Filters Display */}
          {filtersApplied && (
            <div className="mt-3 flex flex-wrap gap-2">
              {searchLocation && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  Location: {searchLocation}
                </span>
              )}
              {selectedCategory && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  Category: {categories.find(c => c.id == selectedCategory)?.name}
                </span>
              )}
              {selectedDate && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                  Date: {selectedDate}
                </span>
              )}
              {priceFilter !== 'all' && (
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                  Price: {priceFilter === 'free' ? 'Free Only' : 'Paid Only'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Hero Section - Improved Alignment */}
        <section className="bg-white py-10 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">Discover Events Near You</h1>
                <p className="text-lg text-gray-600 mb-6">Find, RSVP, and attend amazing events happening in your city. Use the map and filters below to explore!</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-3xl shadow-lg flex items-center justify-center border-4 border-indigo-300">
                  <MapPin className="w-20 h-20 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section - Beautiful Frame */}
        <div className="flex justify-center items-center py-10">
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="rounded-3xl border-4 border-indigo-300 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 shadow-xl overflow-hidden transition-all duration-300" style={{ minHeight: '24rem', maxHeight: '24rem' }}>
              {/* Map Transition Loading Indicator */}
              {mapTransitioning && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center z-20">
                  <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-blue-600 font-medium">Centering map...</span>
                  </div>
                </div>
              )}

              {/* Location Indicator */}
              {mapCoordinates && mapCoordinates[0] !== 40.7128 && (
                <div className="absolute top-4 left-4 bg-white p-3 shadow-lg rounded-lg z-10 max-w-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedEvent ? `Viewing: ${selectedEvent.title}` : 'Map Centered'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Lat: {mapCoordinates[0].toFixed(4)}, Lng: {mapCoordinates[1].toFixed(4)}
                      </p>
                      {selectedEvent && (
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedEvent.location}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setMapCoordinates([40.7128, -74.006]);
                        setSelectedEvent(null);
                      }}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Reset to default location"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="w-full h-full">
                <MapComponent location={mapCoordinates} onLocationChange={setMapCoordinates} />
              </div>

              {/* Map popup card */}
              {filteredEvents.length > 0 && (
                <div className="absolute top-4 right-4 bg-white p-4 shadow-lg rounded-lg w-72 z-10">
                  <h3 className="font-semibold text-lg mb-2">{filteredEvents[0].title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{filteredEvents[0].location}</p>
                  <p className="text-sm text-gray-500 mb-3">{formatDate(filteredEvents[0].start_date)}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">
                      {filteredEvents[0].is_free ? 'Free' : `$${filteredEvents[0].price}`}
                    </span>
                    <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Events Section - Below Map */}
        <div className="bg-gray-50 p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Events Near You <span className="text-gray-500 text-lg">({filteredEvents.length} events found)</span>
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4 text-lg">Loading events...</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
                {filteredEvents.map((event, index) => (
                  <EventCard
                    key={event.id || index}
                    title={event.title}
                    date={formatDate(event.start_date)}
                    location={event.location}
                    rsvps={event.rsvp_count || 0}
                    rating={event.average_rating || 0}
                    category={event.category?.name || 'Uncategorized'}
                    price={event.price}
                    is_free={event.is_free}
                    coverImage={event.cover_image}
                    coordinates={event.coordinates}
                    onShowLocation={(coords) => handleShowLocation(coords, event)}
                    isSelected={selectedEvent?.id === event.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No events found</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white p-4 border-t text-center text-sm text-gray-600">
        <div className="flex justify-center gap-6 mb-2">
          <a href="#" className="hover:underline">About Us</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </footer>

      {/* Floating Action Button */}
      <Link to="/host">
        <button className="fixed bottom-6 right-6 bg-black text-white flex items-center gap-2 px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors">
          <PlusCircle className="w-4 h-5" />
          Host Event
        </button>
      </Link>
    </div>
  );
}
