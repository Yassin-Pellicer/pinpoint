import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  const userId = parseInt(params.userId);

  try {
    const result = await sql`
      SELECT e.*
      FROM event e
      JOIN inscription_user iu  ON e.id = iu.event
      WHERE iu.user = ${userId}
    `;

    const eventIds = result.rows.map((event) => event.id);

    const tagsQuery = await sql`
      SELECT *
      FROM "event_tags"
      WHERE event_id = ANY(${eventIds})
    `;

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
}
