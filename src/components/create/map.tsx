"use client"; // Only needed in Next.js

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const center: [number, number] = [51.505, -0.09]; // London example

export default function MapComponent() {
  return (
    <MapContainer
      center={center}
      zoom={13}
      maxZoom={18}
      className="h-screen w-full z-10"
    >
      <LayersControl position="bottomright">
        <LayersControl.BaseLayer name="CartoDB Positron" checked>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CartoDB</a>'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Google Satellite">
          <TileLayer url="https://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
        </LayersControl.BaseLayer>
      </LayersControl>
      <Marker
        position={center}
        icon={L.icon({
          iconUrl: "/marker-icon.png",
          iconSize: [50, 50],
          iconAnchor: [25, 50],
        })}
      >
        <Popup>
          <div className="bg-white p-2 rounded-md shadow-md">
            Customized Popup Content
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

