import { Checkpoint } from "../../utils/classes/cpClass";

export const addCheckpointsHook = async ( Tags : {eventId: number, data: Checkpoint[]} ) => {

    const { eventId, data } = Tags;

    const res = await fetch("/api/addCheckpoints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, eventId }),
    });

    return await res.json();
};
