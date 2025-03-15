export const getEventsHook = async () => {

    const res = await fetch("/api/getEvents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();

    let events = data.events.map((event) => {
      const { position_lat, position_lng, ...rest } = event;
      return {
        ...rest,
        marker: {position: [position_lat, position_lng], draggable: false},
      };
    });
    data.events = events

    return data
};
