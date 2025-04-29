export const getEventsByBookmark = async (userId?: number) => {

  const res = await fetch(`/api/get/events/getEventsByBookmark/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};
