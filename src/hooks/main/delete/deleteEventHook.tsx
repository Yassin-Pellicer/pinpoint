export const deleteEventHook = async ( id: number ) => {
    const res = await fetch("/api/delete/deleteEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    return await res.json();
};
