import { Tag } from "../../utils/classes/Tag";

export const getEventsHook = async (
  tags: Tag[],
  search: string,
  recommendations?: boolean,
  userLat?: number,
  userLon?: number
) => {
  const queryParams = new URLSearchParams();

  if ( tags && tags.length > 0) {
    queryParams.append("tags", tags.map(tag => tag.id).join(","));
  }

  if (search) {
    queryParams.append("search", search);
  }

  if (recommendations !== undefined) {
    queryParams.append("recommendations", String(recommendations));
  }

  if (userLat !== undefined && userLon !== undefined) {
    queryParams.append("lat", String(userLat));
    queryParams.append("lon", String(userLon));
  }

  const res = await fetch(`/api/getEvents?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.statusText}`);
  }

  const data = await res.json();

  const events = data.events.map((event: any) => {
    const { position_lat, position_lng, ...rest } = event;
    return {
      ...rest,
      marker: {
        position: [position_lat, position_lng],
        draggable: false,
      },
    };
  });

  return { ...data, events };
};
