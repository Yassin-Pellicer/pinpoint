"use client"; 

import {
  MapContainer,
  TileLayer,
  LayersControl,
} from "react-leaflet";

import "react-quill/dist/quill.snow.css";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import { SearchControl } from "../../utils/funcs/searchControl";
import CreateEventsSimple from "./simpleEv/createSimpleEventMarkers";
import CreateEventsCp from "./cpEv/createCheckpointEventMarkers";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useMapContext } from "../../utils/context/ContextMap";
import { useSession } from "../../utils/context/ContextSession";

const center: [number, number] = [51.505, -0.09]; 

export default function MapComponent() {

  const { location, setLocation, zoom, setZoom, originalLocation } = useMapContext();
  const {createType} = useSession();
  
  const [center, setCenter] = useState<[number, number] | null>(() => {
    const savedCenter = sessionStorage.getItem("map-center");
    return savedCenter ? JSON.parse(savedCenter) : null;
  });

  return (
    <MapContainer
      zoom={zoom}    
      maxZoom={18}
      center={[40.4168, -3.7038]}
      doubleClickZoom={false}
      worldCopyJump={true}
      maxBoundsViscosity={0}
      className="h-screen w-full z-10"
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

      {createType === "simple" ? (
        <CreateEventsSimple />
      ) : (
        <CreateEventsCp />
      )}

    </MapContainer>
  );
}

