"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface MapContextType {
  originalLocation: [number, number];
  setOriginalLocation: (location: [number, number]) => void;
  location: [number, number];
  setLocation: (location: [number, number]) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [originalLocation, setOriginalLocation] = useState<[number, number]>([39.4699, -0.3763]);
  const [location, setLocation] = useState<[number, number]>(null);
  const [zoom, setZoom] = useState<number>(14);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
        setOriginalLocation([latitude, longitude]);
        sessionStorage.setItem(
          "map-center",
          JSON.stringify([latitude, longitude])
        );
        sessionStorage.setItem("map-reloaded", "true");
      },
      (error) => {
        console.error("Error getting location. Make sure to allow location access:", error.message);
        setLocation([39.4699, -0.3763]);
        setOriginalLocation([39.4699, -0.3763]);
        sessionStorage.setItem("map-center", JSON.stringify([39.4699, -0.3763]));
        sessionStorage.setItem("map-reloaded", "true");
      }
    );
  }, []);

  return (
    <MapContext.Provider
      value={{
        originalLocation,
        setOriginalLocation,
        location,
        setLocation,
        zoom,
        setZoom
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
