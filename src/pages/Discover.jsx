import React, { useState, useEffect } from 'react';
import { MapPin, CalendarDays, Star, PlusCircle, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import MapComponent from '../components/MapComponent';

const EventCard = ({ title, date, location, rsvps, rating, category, price, is_free, coverImage }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
    {coverImage ? (
      <img
        src={coverImage.startsWith('http') ? coverImage : `http://127.0.0.1:8000${coverImage}`}
        alt={title}
        className="h-32 w-full object-cover rounded mb-2"
      />
    ) : (
      <div className="h-32 bg-gray-300 rounded mb-2 flex items-center justify-center text-sm text-gray-600">
        No Image
      </div>
    )}
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{category}</span>
    </div>
    <p className="text-sm text-gray-500 flex items-center gap-1">
      <CalendarDays className="w-4 h-4" /> {date}
    </p>
    <p className="text-sm text-gray-500 flex items-center gap-1">
      <MapPin className="w-4 h-4" /> {location}
    </p>
    <div className="flex justify-between items-center mt-2">
      <p className="text-sm text-gray-500 flex items-center gap-1">
        {rsvps} RSVPs <Star className="w-4 h-4 ml-2" /> {rating}
      </p>
      <span className="text-sm font-semibold">
        {is_free ? 'Free' : `$${price}`}
      </span>
    </div>
    <button className="mt-2 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors">
      RSVP
    </button>
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b p-4 flex items-center justify-between h-20 shadow-sm">
        <h1 className="text-xl font-bold">EventEase</h1>
        <nav className="flex space-x-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-bold">Home</Link>
          <Link to="/discover" className="text-blue-600 px-3 py-2 text-sm font-bold">Discover</Link>
          <Link to="/my-events" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-bold">My Events</Link>
        </nav>
        <div className="w-8 h-8 rounded-full bg-black"></div>
      </header>
      
      {/* Search and Filters */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
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
          </div>

          {/* Filter Actions */}
          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleApplyFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </button>
            {filtersApplied && (
              <button 
                onClick={handleResetFilters}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

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
<div className="flex flex-1 h-[calc(100vh-160px)]">
  {/* Event List */}
  <aside className="w-1/3 bg-gray-50 p-4 overflow-y-auto flex-shrink-0">
          <h2 className="text-lg font-semibold mb-4">
            Events Near You <span className="text-gray-500">({filteredEvents.length} events found)</span>
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading events...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
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
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No events found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </aside>

        {/* Map View */}
        <main className="flex-1 bg-gray-200 relative overflow-hidden min-w-0">
          <div className="absolute inset-0 w-full h-full">
            <MapComponent location={mapCoordinates} onLocationChange={setMapCoordinates} />
          </div>

          {/* Map popup card */}
          {filteredEvents.length > 0 && (
            <div className="absolute top-4 right-4 bg-white p-4 shadow-lg rounded-lg w-72">
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
        </main>
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
