import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customMarker from '../assets/marker-icon.png';

const CustomIcon = L.icon({
  iconUrl: customMarker || L.Icon.Default.prototype.options.iconUrl,
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

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      const currentCenter = map.getCenter();
      if (currentCenter.lat !== center[0] || currentCenter.lng !== center[1]) {
        map.setView(center, map.getZoom(), { animate: true });
      }
    }
  }, [center, map]);
  return null;
}

export default function MapComponent({ location, onLocationChange }) {
  return (
    <MapContainer
      center={location}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg border border-gray-300 z-0 h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={location} />
      <LocationMarker position={location} setPosition={onLocationChange} />
    </MapContainer>
  );
}
