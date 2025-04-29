export const getTagsHook = async (id: number) => {

  const res = await fetch(`/api/get/getTags/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};
