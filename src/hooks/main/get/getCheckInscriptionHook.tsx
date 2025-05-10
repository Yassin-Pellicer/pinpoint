export const getCheckInscription = async (userId?: number, id?: number) => {

  const res = await fetch(`/api/get/getCheckInscription/${userId}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};