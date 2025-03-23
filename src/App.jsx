import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  background: "white",
};

const defaultCenter = [28.6139, 77.2090]; // New Delhi

const initialSOSCalls = [
  { id: 1, name: "Riya Verma", lat: 18.7041, lng: 77.1025 },
  { id: 2, name: "Neha Sharma", lat: 19.0760, lng: 72.8777 },
  { id: 3, name: "Priya Singh", lat: 12.9716, lng: 77.5946 },
  { id: 4, name: "Priya Mehta", lat: 22.5726, lng: 88.3639 },
  { id: 5, name: "Vineeta Rao", lat: 13.0827, lng: 80.2707 },
];

// Component to control map movement
const MapController = ({ selectedSOS, resetView }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedSOS) {
      map.flyTo([selectedSOS.lat, selectedSOS.lng], 12, { animate: true });
    } else if (resetView) {
      map.flyTo(defaultCenter, 5, { animate: true });
    }
  }, [selectedSOS, resetView, map]);

  return null;
};

const Main = () => {
  const [sosCalls, setSOSCalls] = useState(initialSOSCalls);
  const [selectedSOS, setSelectedSOS] = useState(null);
  const [resetView, setResetView] = useState(false);

  const handleRemoveSOS = (id) => {
    setSOSCalls(sosCalls.filter((sos) => sos.id !== id));
    setSelectedSOS(null);
  };

  const handleZoomOut = () => {
    setSelectedSOS(null);
    setResetView(true);
    setTimeout(() => setResetView(false), 500); // Reset after animation
  };

  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <h2>🚨 SOS Monitoring System</h2>
      </nav>

      <div className="main-content">
        {/* OpenStreetMap (75% of screen) */}
        <div className="map-wrapper">
          <div className="map-container">
            <MapContainer center={defaultCenter} zoom={5} style={mapContainerStyle}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <MapController selectedSOS={selectedSOS} resetView={resetView} />

              {sosCalls.map((sos) => (
                <Marker key={sos.id} position={[sos.lat, sos.lng]} eventHandlers={{ click: () => setSelectedSOS(sos) }}>
                  <Popup>{sos.name}</Popup>
                </Marker>
              ))}

              {/* Blinking Red Circle */}
              {selectedSOS && (
                <Circle
                  center={[selectedSOS.lat, selectedSOS.lng]}
                  pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.5 }}
                  radius={500}
                  className="blinking-circle"
                />
              )}
            </MapContainer>
          </div>
        </div>

        {/* Right Panel (25% of screen) */}
        <div className="right-panel">
          <h3>🔥 Active SOS Calls</h3>
          {sosCalls.map((sos) => (
            <div
              key={sos.id}
              className={`sos-item ${selectedSOS?.id === sos.id ? "selected" : ""}`}
              onClick={() => setSelectedSOS(sos)}
            >
              <p>{sos.name}</p>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="zoom-out-btn" onClick={handleZoomOut}>🔍 Zoom Out</button>
            {selectedSOS && (
              <button className="remove-btn" onClick={() => handleRemoveSOS(selectedSOS.id)}>🗑 Remove</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
