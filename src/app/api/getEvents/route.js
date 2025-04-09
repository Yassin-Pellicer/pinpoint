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
    } else if (tags.length && !search) {
      console.log("gola")
      query = await sql`
        SELECT e.*
        FROM event e
        JOIN event_tags et ON e.id = et.event_id
        WHERE et.tag_id = ANY(${tags})
        GROUP BY e.id
        HAVING COUNT(DISTINCT et.tag_id) = ${tags.length}
    `;
    } else if (!tags.length && search) {
      const searchQuery = `%${search}%`;
      query = await sql`
        SELECT *
        FROM "event"
        WHERE unaccent(lower(name)) LIKE unaccent(lower(${searchQuery}))
           OR unaccent(lower(description)) LIKE unaccent(lower(${searchQuery}))
      `;
    } else {
      query = await sql`
        SELECT e.*
        FROM event e
        JOIN event_tags et ON e.id = et.event_id
        WHERE et.tag_id = ANY(${tags})
        GROUP BY e.id
        HAVING COUNT(DISTINCT et.tag_id) = ${tags.length}
        AND (
          unaccent(lower(name)) LIKE unaccent(lower(${`%${search}%`}))
          OR unaccent(lower(description)) LIKE unaccent(lower(${`%${search}%`}))
        )
      `;
    }

    if (recommendations) {
      const earthRadius = 6371;
      const maxDistance = 10; // in km
      const minLat = userLat - maxDistance / earthRadius * 180 / Math.PI;
      const maxLat = userLat + maxDistance / earthRadius * 180 / Math.PI;
      const deltaLng = maxDistance / earthRadius / Math.cos(userLat * Math.PI / 180) * 180 / Math.PI;
      const minLng = userLon - deltaLng;
      const maxLng = userLon + deltaLng;

      query = await sql`
        SELECT *
        FROM "event"
        WHERE position_lat > ${minLat}
          AND position_lat < ${maxLat}
          AND position_lng > ${minLng}
          AND position_lng < ${maxLng}
        ORDER BY RANDOM()
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
