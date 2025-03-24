export const getRatingUserHook = async (id?: number, userId?: number) => {
  if (typeof id === "undefined" || typeof userId === "undefined") return;

  const res = await fetch(`/api/getRatingUser/${id}/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};

