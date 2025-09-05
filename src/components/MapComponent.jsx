
import React, { useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function MapComponent({ location, onLocationChange }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY // Use Vite env variable
  });

  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    onLocationChange([lat, lng]);
  }, [onLocationChange]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }
  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: location[0], lng: location[1] }}
      zoom={13}
      onClick={handleMapClick}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
      }}
    >
      <Marker position={{ lat: location[0], lng: location[1] }} />
    </GoogleMap>
  );
}
