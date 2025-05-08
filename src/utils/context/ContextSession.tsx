"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Event } from "../classes/Event";
import { getEventsByAuthor, getEventsByBookmark, getEventsByInscription } from "../../hooks/main/get/getEventsHook";
import { User } from "../classes/User";
import { Comment } from "../classes/Comment";
import { Rating } from "../classes/Rating";
import { getUserHook } from "../../hooks/general/getUserHook";

interface SessionContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
  banner: string | null;
  setBanner: (banner: string | null) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  description: string | null;
  setDescription: (description: string | null) => void;
  followers: number | null;
  setFollowers: (followers: number | null) => void;
  following: number | null;
  setFollowing: (following: number | null) => void;
  createdEvents: Event[] | null;
  setCreatedEvents: (createdEvents: Event[] | null) => void;
  comments: Comment[] | null;
  setComments: (comments: Comment[] | null) => void;
  ratings: Rating[] | null;
  setRatings: (ratings: Rating[] | null) => void;
  bookmarks: Event[] | null;
  setBookmarks: (bookmarks: Event[] | null) => void;
  profilePicture: string | null;
  setProfilePicture: (profilePicture: string | null) => void;
  inscriptions: Event[] | null;
  setInscriptions: (inscriptions: Event[] | null) => void;
  fetchInscriptions: boolean;
  triggerFetchInscriptions: () => void;
  fetchBookmarks: boolean;
  triggerFetchBookmarks: () => void;
  link: string | null;
  setLink: (link: string | null) => void;
  memberSince: Date | null;
  setMemberSince: (memberSince: Date | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [fetchInscriptions, setFetchInscriptions] = useState(false);
  const [fetchBookmarks, setFetchBookmarks] = useState(false);

  useEffect(() => {
    const fetchSessionFromCookies = async () => {
      const response = await fetch("/api/session");
      const data = await response.json();
      const userRes = await getUserHook(data.id);
      setUser(userRes.user);
    };

    fetchSessionFromCookies();
  }, [setUser]);

  const setUsername = (name: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, username: name };
    });
  };

  const setDescription = (description: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, description };
    });
  };

  const setBanner = (banner: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, banner };
    });
  };

  const setEmail = (email: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, email };
    });
  };

  const setProfilePicture = (profilePicture: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, profilePicture };
    });
  };

  const setFollowers = (followers: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, followers };
    });
  };

  const setFollowing = (following: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, following };
    });
  };

  const setComments = (comments: Comment[]) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, comments };
    });
  };

  const setRatings = (ratings: Rating[]) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ratings };
    });
  };

  const setCreatedEvents = (createdEvents: Event[]) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, createdEvents };
    });
  };

  const setBookmarks = (bookmarks: Event[]) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, bookmarks };
    });
  };

  const setInscriptions = (inscriptions: Event[]) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, inscriptions };
    });
  };

  const setLink = (link: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, link };
    });
  };

  const setMemberSince = (memberSince: Date) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, memberSince };
    });
  };

  const triggerFetchInscriptions = () => {
    setFetchInscriptions(true);
  };

  const triggerFetchBookmarks = () => {
    setFetchBookmarks(true);
  };

  useEffect(() => { 
    if (fetchInscriptions && user !== null) {
      getEventsByInscription(user?.id).then(async (response) => {
        setInscriptions(response.events);
        setFetchInscriptions(false);
      });
    }
  }, [fetchInscriptions]);

  useEffect(() => { 
    if (fetchBookmarks && user !== null) {
      getEventsByBookmark(user?.id).then(async (response) => {
        setBookmarks(response.events);
        setFetchBookmarks(false);
      });
    }
  }, [fetchBookmarks]);

  useEffect(() => {
    if (user?.id != null) {
      getEventsByInscription(user?.id).then(async (response) => {
        setInscriptions(response.events);
        setFetchInscriptions(false);
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id != null) {
      getEventsByBookmark(user?.id).then(async (response) => {
        setBookmarks(response.events);
        setFetchBookmarks(false);
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id != null) {
      getEventsByAuthor(user?.id).then(async (response) => {
        setCreatedEvents(response.events);
      });
    }
  }, [user?.id]);

  return (
    <SessionContext.Provider
      value={{
        user,
        setUser,
        username: user?.username,
        setUsername,
        banner: user?.banner,
        setBanner,
        email: user?.email,
        setEmail,
        description: user?.description,
        setDescription,
        profilePicture: user?.profilePicture,
        setProfilePicture,        
        followers: user?.followers,
        setFollowers,        
        following: user?.following,
        setFollowing,        
        comments: user?.comments,
        setComments,
        ratings: user?.ratings,
        setRatings,
        bookmarks: user?.bookmarks,
        setBookmarks,
        inscriptions: user?.inscriptions,
        setInscriptions,
        createdEvents: user?.createdEvents,
        setCreatedEvents,
        link: user?.link,
        setLink,
        memberSince: user?.memberSince,
        setMemberSince,
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
