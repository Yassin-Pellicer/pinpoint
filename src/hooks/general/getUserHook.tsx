export const getUserHook = async (userId: number | null) => {

  const res = await fetch(`/api/get/getUser/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};

