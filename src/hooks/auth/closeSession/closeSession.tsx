export const closeSession = async () => {
  const res = await fetch("/api/closeSession", {
    method: "POST",
    credentials: "include",  
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to close session");
  }

  return res.json();
};
