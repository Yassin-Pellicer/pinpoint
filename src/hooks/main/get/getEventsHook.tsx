import { Tag } from "../../../utils/classes/Tag";

export const getEventById = async (id?: number) => {

  const res = await fetch(`/api/get/events/getEvent/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};

export const getEventsDynamic = async (
  userLat?: number,
  userLon?: number,
  zoomLevel?: number,
  events?: any[]
) => {
  const queryParams = new URLSearchParams();

  queryParams.append("lat", String(userLat));
  queryParams.append("lon", String(userLon));
  queryParams.append("zoomLevel", String(zoomLevel));
  queryParams.append("event_ids", events.map((event) => event.id).join(","));

  const res = await fetch(`/api/get/events/getEventsDynamic?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

export const getEventsSearch = async (tags?: Tag[], search?: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append("tags", tags.map((tag) => tag.tag_id).join(","));
  queryParams.append("search", search);
  
  const res = await fetch(`/api/get/events/getEventsSearch?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
}

export const getRecommendations = async (
  userLat?: number,
  userLon?: number,
) => {
  const queryParams = new URLSearchParams();

  queryParams.append("lat", String(userLat));
  queryParams.append("lon", String(userLon));

  const res = await fetch(`/api/get/events/getRecommendations?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
}

