export const getEventsByInscription = async (userId?: number) => {
  if (typeof userId === "undefined") return;

  const res = await fetch(`/api/getEventsByInscription/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  const data = await res.json();

  const result = data.events?.map((event: any) => {
    const { position_lat, position_lng, ...rest } = event;
    return {
      ...rest,
      marker: {
        position: [position_lat, position_lng],
        draggable: false,
      },
    };
  }) ?? [];

  return { ...data, events: result };
};
