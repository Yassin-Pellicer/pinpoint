import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagsParam = searchParams.get("tags"); 
    const search = searchParams.get("search");
    const tags = tagsParam ? tagsParam.split(',').map(Number).filter(n => !isNaN(n)) : [];
    const recommendations = searchParams.get("recommendations");
    const userLat = parseFloat(searchParams.get("lat"));
    const userLon = parseFloat(searchParams.get("lon"));

    let query;

    if (!tags.length && !search) {
      query = await sql`SELECT * FROM "event"`;
    } else if (tags && !search) {
      query = await sql`
        SELECT e.*
        FROM event e
        JOIN event_tags et ON e.id = et.event_id
        WHERE et.tag_id = ANY(${tags})
        GROUP BY e.id
        HAVING COUNT(DISTINCT et.tag_id) = ${tags.length}
    `;
    } else if (!tags && search) {
      query = await sql`
        SELECT *
        FROM "event"
        WHERE unaccent(lower(name)) LIKE unaccent(lower(${`%${search}%`}))
        OR unaccent(lower(description)) LIKE unaccent(lower(${`%${search}%`}))
      `;
    } else {
      query = await sql`
        SELECT *
        FROM "event"
        WHERE tags && ${sql.array(tags, 'int')}
        AND (
          unaccent(lower(name)) LIKE unaccent(lower(${`%${search}%`}))
          OR unaccent(lower(description)) LIKE unaccent(lower(${`%${search}%`}))
        )
      `;
    }

    if (recommendations) {
      query = await sql`
        SELECT *
        FROM "event"
        ORDER BY (position_lat - ${userLat}) * (position_lat - ${userLat}) + (position_lng - ${userLon}) * (position_lng - ${userLon})
        LIMIT 5
      `;
    }

    const response = NextResponse.json({ result: "ok", events: query.rows });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ result: "ko" }, { status: 500 });
  }
}
