export const  addBookmarkHook = async ( eventId: number, id: number) => {
  const res = await fetch("/api/addBookmark", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ eventId, id }),
  });

  return await res.json();
};
