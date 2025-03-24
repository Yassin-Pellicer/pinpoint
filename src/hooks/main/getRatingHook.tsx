export const getRatingHook = async (id?: number) => {
  if (typeof id === "undefined") return;

  const res = await fetch(`/api/getRating/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};

