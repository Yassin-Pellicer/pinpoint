import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagsParam = searchParams.get("tags"); 
    const search = searchParams.get("search");
    const tags = tagsParam ? tagsParam.split(',').map(Number).filter(n => !isNaN(n)) : [];
    const eventsParam = searchParams.get("event_ids");
    const events = eventsParam ? eventsParam.split(',').map(Number).filter(n => !isNaN(n)) : [];
    const recommendations = searchParams.get("recommendations");
    const userLat = parseFloat(searchParams.get("lat"));
    const userLon = parseFloat(searchParams.get("lon"));
    const zoomLevel = parseInt(searchParams.get("zoomLevel"));

    let result;

    if (!tags.length && !search) {
      if (isNaN(userLat) || isNaN(userLon)) {
        return NextResponse.json({ result: "invalid coordinates" }, { status: 400 });
      }

      const earthRadius = 6371;
      const maxDistance = zoomLevel < 10 ? 5000 : 500; // in km
      const minLat = userLat - maxDistance / earthRadius * 180 / Math.PI;
      const maxLat = userLat + maxDistance / earthRadius * 180 / Math.PI;
      const deltaLng = maxDistance / earthRadius / Math.cos(userLat * Math.PI / 180) * 180 / Math.PI;
      const minLng = userLon - deltaLng;
      const maxLng = userLon + deltaLng;
      
      if (events.length > 0) {
        const eventIds = events.join(',');
        
        const query = `
          SELECT * FROM "event"
          WHERE position_lat > $1
            AND position_lat < $2
            AND position_lng > $3
            AND position_lng < $4
            AND id NOT IN (${eventIds})
          ORDER BY 
            (position_lat - $5) * (position_lat - $5) + 
            (position_lng - $6) * (position_lng - $6)
          LIMIT 50
        `;
        
        result = await sql.query(query, [minLat, maxLat, minLng, maxLng, userLat, userLon]);
      } else {
        result = await sql`
          SELECT * FROM "event"
          WHERE position_lat > ${minLat}
            AND position_lat < ${maxLat}
            AND position_lng > ${minLng}
            AND position_lng < ${maxLng}
          ORDER BY 
            (position_lat - ${userLat}) * (position_lat - ${userLat}) + 
            (position_lng - ${userLon}) * (position_lng - ${userLon})
          LIMIT 50
        `;
      }
    } else if (tags.length && !search) {
      result = await sql`
        SELECT e.*
        FROM event e
        JOIN event_tags et ON e.id = et.event_id
        WHERE et.tag_id = ANY(${tags})
        GROUP BY e.id
        HAVING COUNT(DISTINCT et.tag_id) = ${tags.length}
      `;
    } else if (!tags.length && search) {
      const searchQuery = `%${search}%`;
      result = await sql`
        SELECT *
        FROM "event"
        WHERE unaccent(lower(name)) LIKE unaccent(lower(${searchQuery}))
           OR unaccent(lower(description)) LIKE unaccent(lower(${searchQuery}))
      `;
    } else {
      const searchQuery = `%${search}%`;
      result = await sql`
        SELECT e.*
        FROM event e
        JOIN event_tags et ON e.id = et.event_id
        WHERE et.tag_id = ANY(${tags})
        GROUP BY e.id
        HAVING COUNT(DISTINCT et.tag_id) = ${tags.length}
        AND (
          unaccent(lower(e.name)) LIKE unaccent(lower(${searchQuery}))
          OR unaccent(lower(e.description)) LIKE unaccent(lower(${searchQuery}))
        )
      `;
    }

    if (recommendations) {
      if (isNaN(userLat) || isNaN(userLon)) {
        return NextResponse.json({ result: "invalid coordinates" }, { status: 400 });
      }

      const earthRadius = 6371;
      const maxDistance = 10; // in km
      const minLat = userLat - maxDistance / earthRadius * 180 / Math.PI;
      const maxLat = userLat + maxDistance / earthRadius * 180 / Math.PI;
      const deltaLng = maxDistance / earthRadius / Math.cos(userLat * Math.PI / 180) * 180 / Math.PI;
      const minLng = userLon - deltaLng;
      const maxLng = userLon + deltaLng;

      result = await sql`
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

    const response = NextResponse.json(
      result && result.rows && result.rows.length 
        ? { result: "ok", events: result.rows } 
        : { result: "no events found" }
    );
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ result: "ko", error: error.message }, { status: 500 });
  }
}