import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix typical missing markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'
});

const MapView = ({ reminders, userLocation }) => {
  const center = userLocation ? [userLocation.lat, userLocation.lng] : [51.505, -0.09];

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
             <Popup>You are here</Popup>
          </Marker>
        )}
        {reminders.map(rem => (
          <React.Fragment key={rem._id}>
            <Marker position={[rem.latitude, rem.longitude]}>
              <Popup>{rem.title}</Popup>
            </Marker>
            <Circle 
              center={[rem.latitude, rem.longitude]} 
              radius={rem.radius} 
              pathOptions={{ color: 'var(--primary-purple)', fillColor: 'var(--primary-purple)', fillOpacity: 0.2 }}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
