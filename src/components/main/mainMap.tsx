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
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMapContext } from "../../utils/context/ContextMap";
import EventsMap from "./mainEventMarkers";
import CheckpointMap from "./mainCheckpointMarkers";

export default function MapComponent() {

  const { location, setLocation, zoom, setZoom, originalLocation, loadEvents, modifiedEvent, selectedEvent } = useMapContext();

  useEffect(() => {
    loadEvents();
  }, [zoom, location, modifiedEvent, selectedEvent]);

  return (
    <MapContainer
      zoom={zoom}
      maxZoom={25}
      center={location}
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
            maxNativeZoom={20}
            maxZoom={25}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
            maxNativeZoom={20}
            maxZoom={25}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Google Satellite">
          <TileLayer
            url="https://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            maxNativeZoom={22}
            maxZoom={25}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <SearchControl />
      <EventsMap />
      <CheckpointMap />
      
    </MapContainer>
  );
}

