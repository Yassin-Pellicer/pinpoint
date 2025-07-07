export const getCheckpointByCode = async (id?: number, cp?: string) => {
  if (id === undefined) return;

  const res = await fetch(`/api/get/getCheckpointByCode/${id}/${cp}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

const data = await res.json();

if (Array.isArray(data.checkpoints)) {
  data.checkpoints = data.checkpoints.map((event) => {
    const { position_lat, position_lng, ...rest } = event;
    return {
      ...rest,
      marker: {
        position: [position_lat, position_lng],
        draggable: false,
      },
    };
  });
}

return data;

};

