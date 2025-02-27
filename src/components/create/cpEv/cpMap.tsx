"use client"; 

import {
  MapContainer,
  TileLayer,
  LayersControl,
} from "react-leaflet";

import "react-quill/dist/quill.snow.css";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import { SearchControl } from "../../../utils/funcs/searchControl";
import CreateEvents from "./cpEvPlace";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

const center: [number, number] = [51.505, -0.09]; 

export default function MapComponent() {
  return (
    <MapContainer
      zoom={13}    
      maxZoom={18}
      center={center}
      doubleClickZoom={false}
      className="h-screen w-full z-10"
      style={{ outline: "none" }}
      worldCopyJump={true}
      maxBoundsViscosity={0}
    >
      <LayersControl position="bottomleft">
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

      <SearchControl />

      <CreateEvents />

    </MapContainer>
  );
}

