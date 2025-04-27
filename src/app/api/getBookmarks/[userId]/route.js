import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  const userId = parseInt(params.userId);

  if (isNaN(userId)) {
    return NextResponse.json({ result: "invalid id" }, { status: 400 });
  }

  try {
    const result = await sql`
      SELECT e.*
      FROM event e
      JOIN bookmarks book ON e.id = book.event
      WHERE book.user = ${userId}
      AND (
          ("start" IS NULL AND "end" IS NULL)
          OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
          OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
          OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
        )
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

    const response = NextResponse.json(
      result && result.rows && result.rows.length 
        ? { result: "ok", events: eventsWithMarkers } 
        : { result: "no events found" }
    );

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;

  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ result: "ko", error: error.message }, { status: 500 });
  }
}
