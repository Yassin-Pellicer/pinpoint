export const addRatingHook = async ( eventId: number, id: number, rating: number ) => {
    const res = await fetch("/api/addRating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, eventId, id }),
    });

    return await res.json();
};
