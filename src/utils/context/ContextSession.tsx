"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Event } from "../classes/Event";
import { getEventsByAuthor, getEventsByBookmark, getEventsByInscription } from "../../hooks/main/get/getEventsHook";

interface SessionContextType {
  id: number | null;
  setId: (id: number | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  inscriptions: Event[] | null;
  setInscriptions: (inscriptions: Event[] | null) => void;
  bookmarks: Event[] | null;
  setBookmarks: (bookmarks: Event[] | null) => void;
  createdEvents: Event[] | null;
  setCreatedEvents: (createdEvents: Event[] | null) => void;
  fetchInscriptions: boolean;
  triggerFetchInscriptions: () => void;
  fetchBookmarks: boolean;
  triggerFetchBookmarks: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [inscriptions, setInscriptions] = useState<Event[] | null>(null);
  const [bookmarks, setBookmarks] = useState<Event[] | null>(null);
  const [createdEvents, setCreatedEvents] = useState<Event[] | null>(null);

  const [fetchInscriptions, setFetchInscriptions] = useState(false);
  const [fetchBookmarks, setFetchBookmarks] = useState(false);

  const triggerFetchInscriptions = () => {
    setFetchInscriptions(true);
  };

  const triggerFetchBookmarks = () => {
    setFetchBookmarks(true);
  };

  useEffect(() => { 
    if (fetchInscriptions && id !== null) {
      getEventsByInscription(id).then(async (response) => {
        setInscriptions(response.events);
        setFetchInscriptions(false);
      });
    }
  }, [fetchInscriptions]);

  useEffect(() => { 
    if (fetchBookmarks && id !== null) {
      getEventsByBookmark(id).then(async (response) => {
        setBookmarks(response.events);
        setFetchBookmarks(false);
      });
    }
  }, [fetchBookmarks]);

  useEffect(() => {
    if (id !== null) {
      getEventsByInscription(id).then(async (response) => {
        setInscriptions(response.events);
        setFetchInscriptions(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (id !== null) {
      getEventsByBookmark(id).then(async (response) => {
        setBookmarks(response.events);
        setFetchBookmarks(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (id !== null) {
      getEventsByAuthor(id).then(async (response) => {
        setCreatedEvents(response.events);
      });
    }
  }, [id]);

  return (
    <SessionContext.Provider
      value={{
        id,
        setId,
        username,
        setUsername,
        inscriptions,
        setInscriptions,
        bookmarks,
        setBookmarks,
        createdEvents,
        setCreatedEvents,
        fetchInscriptions,
        triggerFetchInscriptions,
        fetchBookmarks,
        triggerFetchBookmarks,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
