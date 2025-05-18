import { connectToDatabase } from "../../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const client = await connectToDatabase();
  const userId = parseInt(params.userId);

  try {
    const result = await client.query(
      `SELECT e.* FROM event e WHERE e.author = $1 AND ("isPublic" = true
        OR ("isPublic" = false AND id IN (SELECT event FROM unlocked_event WHERE "user" = $1))
        )`,
      [userId]
    );

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

    return NextResponse.json({ events: eventsWithMarkers });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  finally { 
    client.release(); // This is critical
  }
}

