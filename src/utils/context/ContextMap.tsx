"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Tag } from "../classes/Tag";
import { Event } from "../classes/Event";
import { getEventsDynamic, getEventsSearch, getRecommendations } from "../../hooks/main/get/getEventsHook";
import { getActivitiesFollowers } from "../../hooks/main/get/getActivitiesFollowers";
import { useSession } from "./ContextSession";
import { getActivitiesGlobal } from "../../hooks/main/get/getActivitiesGlobal";

interface MapContextType {
  events: Event[];
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
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
  modifiedEvent: Event | null;
  setModifiedEvent: (event: Event | null) => void;
  loadEvents: () => Promise<void>;
  loadSearchEvents: (tags: Tag[], searchTerm: string) => Promise<void>;
  loadRecommendations: () => Promise<void>;
  userActivityFeed: any[];
  setUserActivityFeed: (userActivityFeed: any[]) => void;
  globalActivityFeed: any[];
  setGlobalActivityFeed: (globalActivityFeed: any[]) => void;
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
  const [modifiedEvent, setModifiedEvent] = useState<Event | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [userActivityFeed, setUserActivityFeed ] = useState([]);
  const [globalActivityFeed, setGlobalActivityFeed ] = useState([]);

  const {user} = useSession();

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

  useEffect(() => {
    if (user?.id != null) {
      getActivitiesFollowers(user.id).then((response) => {
        setGlobalActivityFeed((prev) => [
          ...prev,
          ...response.activities.filter(
            (activity) => !prev.some((a) => a.id === activity.id)
          ),
        ]);
      });

      getActivitiesGlobal().then((response) => {
        setUserActivityFeed((prev) => [
          ...prev,
          ...response.activities.filter(
            (activity) => !prev.some((a) => a.id === activity.id)
          ),
        ]);
      });
    }
  }, [user]);

  const loadEvents = async () => {
    const response = await getEventsDynamic(location?.[0], location?.[1], zoom,
       events.filter((event) => event.id !== selectedEvent?.id && event.id !== modifiedEvent?.id)
    );
    if (response.events) {
      const updatedMap = new Map(
        events.map((event) => [event.id, event])
      );
      response.events.forEach((event) => {
        updatedMap.set(event.id, event);
      });
      setEvents(Array.from(updatedMap.values()));
      setModifiedEvent(null);
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

  useEffect(() => { loadRecommendations(); }, [])

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
        modifiedEvent,
        setModifiedEvent,
        editMode,
        setEditMode,
        userActivityFeed,
        setUserActivityFeed,
        globalActivityFeed,
        setGlobalActivityFeed
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