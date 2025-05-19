export const deleteEventHook = async ( eventId: number ) => {
    const res = await fetch("/api/delete/deleteEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId }),
    });

    return await res.json();
};
