import { Tag } from "../../../utils/classes/Tag";

export const getEventById = async (id?: number) => {
  const res = await fetch(`/api/get/events/getEvent/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  return await res.json();
};

export const getEventsByInscription = async (userId?: number) => {
  const res = await fetch(`/api/get/events/getEventsByInscription/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  return await res.json();
};

export const getEventsByBookmark = async (userId?: number) => {
  const res = await fetch(`/api/get/events/getEventsByBookmark/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  return await res.json();
};

export const getEventsByAuthor = async (userId?: number) => {
  const res = await fetch(`/api/get/events/getEventsByAuthor/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  return await res.json();
};

export const getEventsDynamic = async (
  userLat?: number,
  userLon?: number,
  zoomLevel?: number,
  events?: any[],
  userId?: number
) => {
  const queryParams = new URLSearchParams();

  queryParams.append("lat", String(userLat));
  queryParams.append("lon", String(userLon));
  queryParams.append("zoomLevel", String(zoomLevel));
  queryParams.append("event_ids", events.map((event) => event.id).join(","));
  queryParams.append("userId", String(userId));

  const res = await fetch(
    `/api/get/events/getEventsDynamic?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return await res.json();
};

export const getEventsSearch = async (
  tags?: Tag[],
  search?: string,
  userId?: number
) => {
  const queryParams = new URLSearchParams();
  queryParams.append("tags", tags.map((tag) => tag.tag_id).join(","));
  queryParams.append("search", search);
  queryParams.append("userId", String(userId));

  const res = await fetch(
    `/api/get/events/getEventsSearch?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return await res.json();
};

export const getRecommendations = async (
  userLat?: number,
  userLon?: number,
  userId?: number
) => {
  const queryParams = new URLSearchParams();

  queryParams.append("lat", String(userLat));
  queryParams.append("lon", String(userLon));
  queryParams.append("userId", String(userId));

  const res = await fetch(
    `/api/get/events/getRecommendations?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return await res.json();
};
