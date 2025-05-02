import { Event } from "../../utils/classes/Event";

export const createEventHook = async (data: Event) => {

  const { id, name, description, marker, banner, qr, isPublic, author, enableComments, enableRatings, enableInscription, capacity, start, end, date, tags} = data;

    const res = await fetch("/api/add/addEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, description, marker, banner, qr, isPublic, author, enableComments, enableRatings, enableInscription, capacity, start, end, date, tags}),
    });

    return await res.json();
};
