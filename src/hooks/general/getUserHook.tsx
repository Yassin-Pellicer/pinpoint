export const getUserHook = async (id: number | null) => {
  if (typeof id === "undefined") return;

  const res = await fetch(`/api/getUser/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};

