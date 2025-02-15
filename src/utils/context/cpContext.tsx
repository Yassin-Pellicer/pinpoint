"use client";
import { createContext, useContext, useState } from "react";
import { Checkpoint } from "../classes/cpClass";

interface CheckpointsContextType {
  checkpoints: Checkpoint[];
  setCheckpoints: React.Dispatch<React.SetStateAction<Checkpoint[]>>;
  focusedCheckpoint: Checkpoint | null;
  setFocusedCheckpoint: React.Dispatch<React.SetStateAction<Checkpoint | null>>;
}

const CheckpointsContext = createContext<CheckpointsContextType | undefined>(
  undefined
);

export const CheckpointsProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [focusedCheckpoint, setFocusedCheckpoint] = useState<Checkpoint | null>(null);

  return (
    <CheckpointsContext.Provider value={{ checkpoints, setCheckpoints, focusedCheckpoint, setFocusedCheckpoint }}>
      {children}
    </CheckpointsContext.Provider>
  );
};

export const useCheckpoints = () => {
  return useContext(CheckpointsContext);
};
