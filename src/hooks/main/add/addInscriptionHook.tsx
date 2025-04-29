export const  addInscriptionHook = async ( eventId: number, id: number) => {
  const res = await fetch("/api/add/addInscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ eventId, id }),
  });

  return await res.json();
};
