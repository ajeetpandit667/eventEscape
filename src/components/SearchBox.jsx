// SearchBox.jsx
import React, { useState } from 'react';

export default function SearchBox({ onResult, onSearchQuery }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        onResult([lat, lon]);
        if (onSearchQuery) {
          onSearchQuery(query);
        }
        setError('');
      } else {
        setError('Location not found.');
      }
    } catch (err) {
      setError('Search failed.');
    }
  };

  const handleKeyPress = (e) => {
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
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
