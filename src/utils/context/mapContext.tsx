"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Tag } from "../classes/Tag";

interface MapContextType {
  originalLocation: [number, number];
  setOriginalLocation: (location: [number, number]) => void;
  location: [number, number] | null;
  setLocation: (location: [number, number] | null) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  filterTags: Tag[];
  setFilterTags: (filterTags: Tag[]) => void;
  search: string;
  setSearch: (search: string) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [originalLocation, setOriginalLocation] = useState<[number, number]>([39.4699, -0.3763]);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number>(14);
  const [filterTags, setFilterTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");

  // Load location
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
        setZoom,
        filterTags,
        setFilterTags,
        search,
        setSearch,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};