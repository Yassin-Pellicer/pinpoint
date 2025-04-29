import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function GET(_request, { params }) {
  const id = parseInt(params.id);

  try {
    const result = await sql`
      SELECT e.*
      FROM event e
      WHERE e.id = ${id}
    `;

    const eventIds = result.rows.map(event => event.id);

    const tagsQuery = await sql`
      SELECT *
      FROM "event_tags"
      WHERE event_id = ANY(${eventIds})
    `;

    const eventsWithMarkers = result.rows?.map((event) => {
      const eventTags = tagsQuery.rows.filter((tag) => tag.event_id === event.id);
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

    return NextResponse.json({event: eventsWithMarkers[0]});

  } catch (error) {
    return NextResponse.json({ result: "ko", error: error.message }, { status: 500 });
  }
}