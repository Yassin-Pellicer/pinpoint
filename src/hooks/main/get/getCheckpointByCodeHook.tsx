export const getCheckpointByCode = async (id?: number, cp?: string) => {
  if (id === undefined) return;

  const res = await fetch(`/api/get/getCheckpointByCode/${id}/${cp}`, {
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

