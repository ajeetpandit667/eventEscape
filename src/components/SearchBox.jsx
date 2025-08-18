// SearchBox.jsx
import React, { useState } from 'react';

export default function SearchBox({ onResult, onSearchQuery }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a location.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`,
        { headers: { 'User-Agent': 'EventEase/1.0 (youremail@example.com)' } }
      );

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        onResult([lat, lon]);
        if (onSearchQuery) onSearchQuery(query);
        setError('');
      } else {
        setError('Location not found.');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter a place, e.g., Delhi, India"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`px-4 py-2 text-white rounded transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
