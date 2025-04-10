// utils/hooks/useEvents.ts
import { Tag } from "../../utils/classes/Tag";
import { useEvent } from "../../utils/context/eventContext";

export const getEventsHook = async (
  tags?: Tag[],
  search?: string,
  recommendations?: boolean,
  userLat?: number,
  userLon?: number,
  zoomLevel?: number,
  events?: any[]
) => {
  const queryParams = new URLSearchParams();

  if (tags?.length) {
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

  if (zoomLevel !== undefined) {
    queryParams.append("zoomLevel", String(zoomLevel));
  }

  if (events && events.length > 0) {
    queryParams.append("event_ids", events.map(event => event.id).join(","));
  }
  
  const res = await fetch(`/api/getEvents?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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

  return { ...data, events: result }; // Correct the return key to match consumer usage
};
