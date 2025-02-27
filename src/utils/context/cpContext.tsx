"use client";
import { createContext, useContext, useState } from "react";
import { Checkpoint } from "../classes/cpClass";

interface CheckpointsContextType {
  checkpoints: Checkpoint[];
  focusedCheckpoint: Checkpoint | null;
  
  setCheckpoints: React.Dispatch<React.SetStateAction<Checkpoint[]>>;
  setFocusedCheckpoint: React.Dispatch<React.SetStateAction<Checkpoint | null>>;
  setId: (id: number, checkpointId: number) => void;
  setDescription: (description: string, checkpointId: number) => void;
  setOrder: (order: number, checkpointId: number) => void;
  setName: (name: string, checkpointId: number) => void;
  setMarker: (marker: any, checkpointId: number) => void;
  setBanner: (banner: any, checkpointId: number) => void;
}

const CheckpointsContext = createContext<CheckpointsContextType | undefined>(undefined);

export const CheckpointsProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [focusedCheckpoint, setFocusedCheckpoint] = useState<Checkpoint | null>(null);

  const setId = (id: number, checkpointId: number) => {
    setCheckpoints((prev) =>
      prev.map((checkpoint) =>
        checkpoint.id === checkpointId ? { ...checkpoint, id } : checkpoint
      )
    );
  };

  const setDescription = (description: string, checkpointId: number) => {
    setCheckpoints((prev) =>
      prev.map((checkpoint) =>
        checkpoint.id === checkpointId ? { ...checkpoint, description } : checkpoint
      )
    );
  };

  const setOrder = (order: number, checkpointId: number) => {
    setCheckpoints((prev) =>
      prev.map((checkpoint) =>
        checkpoint.id === checkpointId ? { ...checkpoint, order } : checkpoint
      )
    );
  };

  const setName = (name: string, checkpointId: number) => {
    setCheckpoints((prev) =>
      prev.map((checkpoint) =>
        checkpoint.id === checkpointId ? { ...checkpoint, name } : checkpoint
      )
    );
  };

  const setMarker = (marker: any, checkpointId: number) => {
    setCheckpoints((prev) =>
      prev.map((checkpoint) =>
        checkpoint.id === checkpointId ? { ...checkpoint, marker } : checkpoint
      )
    );
  };

  const setBanner = (banner: any, checkpointId: number) => {
    setCheckpoints((prev) =>
      prev.map((checkpoint) =>
        checkpoint.id === checkpointId ? { ...checkpoint, banner } : checkpoint
      )
    );
  };

  return (
    <CheckpointsContext.Provider
      value={{
        checkpoints,
        focusedCheckpoint,
        setCheckpoints,
        setFocusedCheckpoint,
        setId,
        setDescription,
        setOrder,
        setName,
        setMarker,
        setBanner,
      }}
    >
      {children}
    </CheckpointsContext.Provider>
  );
};

export const useCheckpoints = () => {
  const context = useContext(CheckpointsContext);
  if (!context) {
    throw new Error("useCheckpoints must be used within a CheckpointsProvider");
  }
  return context;
};
