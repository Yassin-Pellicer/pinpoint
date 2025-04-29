"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Tag } from "../classes/Tag";
import { Event } from "../classes/Event";
import { getEventById, getEventsDynamic, getEventsSearch, getRecommendations } from "../../hooks/main/get/getEventsHook";
import { get } from "http";

interface MapContextType {
  events: Event[];
  setEvents: (events: Event[]) => void;
  searchResults: any[];
  setSearchResults: (searchResult: any[]) => void;
  selectedEvent: Event | null;
  setSelectedEvent: (event: any) => void;
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
  recommendations: any[];
  setRecommendations: (recommendations: any[]) => void;
  loadEvents: () => Promise<void>;
  loadSearchEvents: (tags: Tag[], searchTerm: string) => Promise<void>;
  loadRecommendations: () => Promise<void>;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [originalLocation, setOriginalLocation] = useState<[number, number]>([39.4699, -0.3763]);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState<number>(14);
  const [filterTags, setFilterTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
        setOriginalLocation([latitude, longitude]);
      },
      (error) => {
        setLocation([39.4699, -0.3763]);
        setOriginalLocation([39.4699, -0.3763]);
      }
    );
  }, []);

  const loadEvents = async () => {
    const response = await getEventsDynamic(location?.[0], location?.[1], zoom,
       events.filter((event) => event.id !== selectedEvent?.id)
    );
    if (response.events) {
      const updatedMap = new Map(
        events
          .filter((event) => event.id !== selectedEvent?.id)
          .map((event) => [event.id, event])
      );
      response.events.forEach((event) => {
        updatedMap.set(event.id, event);
      });
      setEvents(Array.from(updatedMap.values()));
    }
  };

  const loadSearchEvents = async (tags, searchTerm) => {
    const response = await getEventsSearch(tags, searchTerm);
    if (response.events) {
      setSearchResults(response.events);
      const newEventIds = new Set(events.map((event) => event.id));
      const nonDuplicateEvents = response.events.filter(
        (event) => !newEventIds.has(event.id)
      );
      setEvents((prev) => [...prev, ...nonDuplicateEvents]);
    }
  };

  const loadRecommendations = async () => {
    const response = await getRecommendations(originalLocation?.[0], originalLocation?.[1]);
    setRecommendations(response.events);
  };

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
        recommendations,
        setRecommendations,
        searchResults,
        setSearchResults,
        selectedEvent,
        setSelectedEvent,
        events,
        setEvents,
        loadEvents,
        loadSearchEvents,
        loadRecommendations,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};