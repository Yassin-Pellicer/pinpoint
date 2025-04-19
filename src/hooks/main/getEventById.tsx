export const getEventById = async (id?: number) => {
  if (typeof id === "undefined") return;

  const res = await fetch(`/api/getEvent/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  const data = await res.json();

  const event = data.event;
  if (!event) return;

  const { position_lat, position_lng, ...rest } = event;
  return {
    ...rest,
    marker: {
      position: [position_lat, position_lng],
      draggable: false,
    },
  };
};
