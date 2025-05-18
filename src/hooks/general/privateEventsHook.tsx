export const addUnlockedEvent = async (userId, password) => {

  const res = await fetch("/api/add/addUnlockedEvent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({userId, password}),
  });

  return await res.json();
};

export const getEventCode = async (eventId) => {

  const res = await fetch(`/api/get/getEventCode/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};

export const getPermission = async (eventId) => {

  const res = await fetch(`/api/get/getEventPermission/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};