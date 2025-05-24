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

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

export default function MapContainerComponent() {
  const { location, setLocation, zoom, setZoom, originalLocation } = useMapContext();
  const { createType } = useSession();
  
  const [center, setCenter] = useState<[number, number] | null>(() => {
    if (typeof window !== 'undefined') {
      const savedCenter = sessionStorage.getItem("map-center");
      return savedCenter ? JSON.parse(savedCenter) : null;
    }
    return null;
  });

  return (
    <>
      {location && (
        <MapContainer
          zoom={zoom}
          maxZoom={18}
          center={location}
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
      )}
    </>
  );
}