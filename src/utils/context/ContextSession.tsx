"use client";

import { createContext, useContext, useState } from "react";

interface SessionContextType {
  id: number | null;
  setId: (id: number | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);

  return (
    <SessionContext.Provider
      value={{
        id,
        setId,
        username,
        setUsername,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
