"use client";
import { createContext, useContext, useState } from "react";
import { Event } from "../classes/EventClass";
import { Tag } from "../classes/Tag";

interface EventContextType {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  selectedEvent: Event | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  event: Event;
  setEvent: React.Dispatch<React.SetStateAction<Event>>;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  marker: any;
  setMarker: (marker: any) => void;
  banner: string;
  setBanner: (banner: string) => void;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  qr: boolean;
  setQr: (qr: boolean) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  author: string;
  setAuthor: (author: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [event, setEvent] = useState<Event>(new Event());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const setName = (name: string) => {
    setEvent((prev) => ({ ...prev, name }));
  };

  const setDescription = (description: string) => {
    setEvent((prev) => ({ ...prev, description }));
  };

  const setMarker = (marker: any) => {
    setEvent((prev) => ({ ...prev, marker }));
  };

  const setBanner = (banner: string) => {
    setEvent((prev) => ({ ...prev, banner }));
  };

  const setTags = (tags: Tag[]) => {
    setEvent((prev) => ({ ...prev, tags }));
  };

  const setQr = (qr: boolean) => {
    setEvent((prev) => ({ ...prev, qr }));
  };

  const setIsPublic = (isPublic: boolean) => {
    setEvent((prev) => ({ ...prev, isPublic }));
  };

  const setAuthor = (author: string) => {
    setEvent((prev) => ({ ...prev, author }));
  };

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        selectedEvent,
        setSelectedEvent,
        event,
        setEvent,
        name: event.name,
        setName,
        description: event.description,
        setDescription,
        marker: event.marker,
        setMarker,
        banner: event.banner,
        setBanner,
        tags: event.tags,
        setTags,
        qr: event.qr,
        setQr,
        isPublic: event.isPublic,
        setIsPublic,
        author: event.author,
        setAuthor
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
