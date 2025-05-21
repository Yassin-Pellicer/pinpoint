import { connectToDatabase } from "../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const client = await connectToDatabase();
  try {
    const { searchParams } = new URL(request.url);
    const tagsParam = searchParams.get("tags");
    const search = searchParams.get("search");
    let userId = parseInt(searchParams.get("userId"));
    const tags = tagsParam
      ? tagsParam
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n))
      : [];
    if (isNaN(userId)) userId = -1;
    let result;

    if (tags.length && !search) {
      result = await client.query(
        `
        SELECT e.*
        FROM event e
        JOIN event_tags et ON e.id = et.event_id
        WHERE et.tag_id = ANY($1)
AND ("isPublic" = true
        OR ("isPublic" = false AND id IN (SELECT event FROM unlocked_event WHERE "user" = $3))
        )
         AND (
          ("start" IS NULL AND "end" IS NULL)
          OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
          OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
          OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
        )
        GROUP BY e.id
        HAVING COUNT(DISTINCT et.tag_id) = $2
      `,
        [tags, tags.length, userId]
      );
    } else if (!tags.length && search) {
      const searchQuery = `%${search}%`;
      result = await client.query(
        `
        SELECT *
        FROM "event" e
        WHERE (
          unaccent(lower(e.name)) LIKE unaccent(lower($1))
          OR unaccent(lower(e.description)) LIKE unaccent(lower($1))
        )
AND (e."isPublic" = true
        OR (e."isPublic" = false AND id IN (SELECT event FROM unlocked_event WHERE "user" = $2))
        )
        AND (
          ("start" IS NULL AND "end" IS NULL)
          OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
          OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
          OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
        )
      `,
        [searchQuery, userId]
      );
    } else {
      const searchQuery = `%${search}%`;
      result = await client.query(
        `
        SELECT e.*
        FROM event e
        JOIN event_tags et ON e.id = et.event_id
        WHERE et.tag_id = ANY($1)
AND (e."isPublic" = true
        OR (e."isPublic" = false AND id IN (SELECT event FROM unlocked_event WHERE "user" = $4))
        )
        AND (
          ("start" IS NULL AND "end" IS NULL)
          OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
          OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
          OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
        )
        AND (
          unaccent(lower(e.name)) LIKE unaccent(lower($2))
          OR unaccent(lower(e.description)) LIKE unaccent(lower($2))
        )
        GROUP BY e.id
        HAVING COUNT(DISTINCT et.tag_id) = $3
      `,
        [tags, searchQuery, tags.length, userId]
      );
    }

    const eventIds = result.rows.map((event) => event.id);

    const tagsQuery = await client.query(
      `
      SELECT *
      FROM "event_tags"
      WHERE event_id = ANY($1)
    `,
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
      { result: "ko", error: error.message },
      { status: 500 }
    );
  } finally {
    client.release(); // This is critical
  }
}
