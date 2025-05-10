export const getCheckBookmark = async (userId?: number, id?: number) => {

  const res = await fetch(`/api/get/getCheckBookmark/${userId}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};