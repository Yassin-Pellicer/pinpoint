import { Tag } from "../../utils/classes/Tag";

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
    queryParams.append("tags", tags.map((tag) => tag.tag_id).join(","));
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

  return await res.json();
}

