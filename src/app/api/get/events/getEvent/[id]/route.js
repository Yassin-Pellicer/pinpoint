import { connectToDatabase } from "../../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const client = await connectToDatabase();

  const id = parseInt(params.id);

  try {
    let result;
    result = await client.query("SELECT e.* FROM event e WHERE e.id = $1", [
      id,
    ]);

    const eventIds = result.rows.map((event) => event.id);

    const tagsQuery = await client.query(
      'SELECT * FROM "event_tags" WHERE event_id = ANY($1)',
      [eventIds]
    );

    const eventsWithMarkers =
      result.rows?.map((event) => {
        const eventTags = tagsQuery.rows.filter(
          (tag) => tag.event_id === event.id
        );
        const { position_lat, position_lng, ...rest } = event;
        return {
          ...rest,
          marker: {
            position: [position_lat, position_lng],
            draggable: false,
          },
          tags: eventTags,
        };
      }) ?? [];

    return NextResponse.json({ event: eventsWithMarkers[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { result: "ko", error: error.message },
      { status: 500 }
    );
  } finally {
    client.release(); // This is critical
  }
}
