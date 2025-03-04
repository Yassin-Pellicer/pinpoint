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
  const [originalLocation, setOriginalLocation] = useState<[number, number]>([48.8566, 2.3522]);
  const [location, setLocation] = useState<[number, number]>(null);
  const [zoom, setZoom] = useState<number>(14);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Got location:", latitude, longitude);
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
        setLocation([48.8566, 2.3522]); 
        setOriginalLocation([48.8566, 2.3522]); 
        sessionStorage.setItem("map-center", JSON.stringify([48.8566, 2.3522]));
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
