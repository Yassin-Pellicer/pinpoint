export const getActivitiesGlobal = async () => {

  const res = await fetch(`/api/get/getActivitiesGlobal`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};
