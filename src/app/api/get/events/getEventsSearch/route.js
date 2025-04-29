import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagsParam = searchParams.get("tags"); 
    const search = searchParams.get("search");
    const tags = tagsParam ? tagsParam.split(',').map(Number).filter(n => !isNaN(n)) : [];

    let result;

    if (tags.length && !search) {
      result = await sql`
        SELECT e.*
        FROM event e
        JOIN event_tags et ON e.id = et.event_id
        WHERE et.tag_id = ANY(${tags})
         AND (
          ("start" IS NULL AND "end" IS NULL)
          OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
          OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
          OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
        )
        GROUP BY e.id
        HAVING COUNT(DISTINCT et.tag_id) = ${tags.length}
      `;
    } else if (!tags.length && search) {
      const searchQuery = `%${search}%`;
      result = await sql`
        SELECT *
        FROM "event"
        WHERE (
          unaccent(lower(e.name)) LIKE unaccent(lower(${searchQuery}))
          OR unaccent(lower(e.description)) LIKE unaccent(lower(${searchQuery}))
        )
        AND (
          ("start" IS NULL AND "end" IS NULL)
          OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
          OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
          OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
        )
      `;
    } else {
      const searchQuery = `%${search}%`;
      result = await sql`
        SELECT e.*
        FROM event e
        JOIN event_tags et ON e.id = et.event_id
        WHERE et.tag_id = ANY(${tags})
        AND (
          ("start" IS NULL AND "end" IS NULL)
          OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
          OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
          OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
        )
        AND (
          unaccent(lower(e.name)) LIKE unaccent(lower(${searchQuery}))
          OR unaccent(lower(e.description)) LIKE unaccent(lower(${searchQuery}))
        )
        GROUP BY e.id
        HAVING COUNT(DISTINCT et.tag_id) = ${tags.length}
      `;
    }

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

    return NextResponse.json({events: eventsWithMarkers});

  } catch (error) {
    return NextResponse.json({ result: "ko", error: error.message }, { status: 500 });
  }
}