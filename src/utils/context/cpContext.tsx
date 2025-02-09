"use client";
import { createContext, useContext, useState } from "react";
import { Checkpoint } from "../classes/cpClass";

interface CheckpointsContextType {
  checkpoints: Checkpoint[];
  setCheckpoints: React.Dispatch<React.SetStateAction<Checkpoint[]>>;
}

const CheckpointsContext = createContext<CheckpointsContextType | undefined>(
  undefined
);


export const CheckpointsProvider = ({ children }: { children: React.ReactNode }) => {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  return (
    <CheckpointsContext.Provider value={{ checkpoints, setCheckpoints }}>
      {children}
    </CheckpointsContext.Provider>
  );
};

export const useCheckpoints = () => {
  return useContext(CheckpointsContext);
};
