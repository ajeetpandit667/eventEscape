import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customMarker from '../assets/marker-icon.png';

const CustomIcon = L.icon({
  iconUrl: customMarker,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? (
    <Marker position={position} icon={CustomIcon}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
}

// Component to programmatically move the map view
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center]);
  return null;
}

export default function MapComponent({ location, onLocationChange }) {
  return (
    <MapContainer
      center={location}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '256px', width: '100%' }}
      className="rounded-lg border border-gray-300 z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={location} />
      <LocationMarker position={location} setPosition={onLocationChange} />
    </MapContainer>
  );
}
