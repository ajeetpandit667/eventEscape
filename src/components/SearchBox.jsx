// SearchBox.jsx
import React, { useState } from 'react';

export default function SearchBox({ onResult }) {
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
        setError('');
      } else {
        setError('Location not found.');
      }
    } catch (err) {
      setError('Search failed.');
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Search Location
      </label>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter a place, e.g., India Gate"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
