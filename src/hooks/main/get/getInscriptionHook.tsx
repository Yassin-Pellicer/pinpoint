export const getInscriptionHook = async (id?: number, userId?: number) => {

  const res = await fetch(`/api/getInscription/${id}/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};

