"use client";
import { createContext, useContext, useState } from "react";
import { Event } from "../classes/Event";
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
  comments: any[];
  setComments: (comments: any[]) => void;
  enableRatings: boolean;
  setEnableRatings: (ratings: boolean) => void;
  enableComments: boolean;
  setEnableComments: (comments: boolean) => void;
  rating: number;
  setRating: (rating: number) => void;
  enableInscription: boolean;
  setEnableInscription: (inscription: boolean) => void;
  checkpoints: any[];
  setCheckpoints: (checkpoints: any[]) => void;
  address: string;
  setAddress: (address: string) => void;
  capacity: number;
  setCapacity: (capacity: number) => void;
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

  const setComments = (comments: any[]) => {
    setEvent((prev) => ({ ...prev, comments }));
  };

  const setEnableRatings = (enableRatings: boolean) => {
    setEvent((prev) => ({ ...prev, enableRatings }));
  };

  const setEnableComments = (enableComments: boolean) => {
    setEvent((prev) => ({ ...prev, enableComments }));
  };

  const setRating = (rating: number) => {
    setEvent((prev) => ({ ...prev, rating }));
  };

  const setAddress = (address: string) => {
    setEvent((prev) => ({ ...prev, address }));
  };

  const setCheckpoints = (checkpoints: any[]) => {
    setEvent((prev) => ({ ...prev, checkpoints }));
  };  

  const setEnableInscription = (enableInscription: boolean) => {
    setEvent((prev) => ({ ...prev, enableInscription }));
  };

  const setCapacity = (capacity: number) => {
    setEvent((prev) => ({ ...prev, capacity }));
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
        setAuthor,
        comments: event.comments,
        setComments,
        enableRatings: event.enableRatings,
        setEnableRatings,
        enableComments: event.enableComments,
        setEnableComments,
        rating: event.rating,
        setRating,
        checkpoints: event.checkpoints,
        setCheckpoints,
        enableInscription: event.enableInscription,
        setEnableInscription,
        address: event.address,
        setAddress,
        capacity: event.capacity,
        setCapacity,
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
