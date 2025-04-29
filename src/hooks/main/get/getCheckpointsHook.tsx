export const getCheckpointsHook = async (id?: number) => {
  if (id === undefined) return;

  const res = await fetch(`/api/get/getCheckpoints/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await res.json();
  let checkpoints = data.checkpoints?.map((event) => {
    const { position_lat, position_lng, ...rest } = event;
    return {
      ...rest,
      marker: {position: [position_lat, position_lng], draggable: false},
    };
  });
  data.checkpoints = checkpoints

  return data
};

