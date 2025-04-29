export const getCommentsHook = async (id: number | null) => {
  if (typeof id === "undefined") return;

  const res = await fetch(`/api/get/getComments/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};

