import { Event } from "../../utils/classes/Event";
import { Tag } from "../../utils/classes/Tag";

export const addTagsHook = async ( Tags : {eventId: number, data: Tag[]} ) => {

    const { eventId, data } = Tags;

    const res = await fetch("/api/addTags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, eventId }),
    });

    return await res.json();
};
