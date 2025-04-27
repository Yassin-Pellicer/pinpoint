export const getBookmarksHook = async (userId?: number) => {
  if (typeof userId === "undefined") return;

  const res = await fetch(`/api/getBookmarks/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'Cache-Control': 'no-cache'
    },
  });

  return await res.json();
};
