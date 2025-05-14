export const getActivities = async (userId?: number) => {

  const res = await fetch(`/api/get/getActivities/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};
