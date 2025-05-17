export const getInscribedUsers = async (id?: number) => {

  const res = await fetch(`/api/get/getInscribedUsers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};
