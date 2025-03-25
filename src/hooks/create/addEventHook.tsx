import { Event } from "../../utils/classes/EventClass";

export const createEventHook = async (data: Event) => {

  const { name, description, marker, banner, qr, isPublic, author, enableComments, enableRatings } = data;

    const res = await fetch("/api/createEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, marker, banner, qr, isPublic, author, enableComments, enableRatings }),
    });

    return await res.json();
};
