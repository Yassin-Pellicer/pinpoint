import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const userLat = parseFloat(searchParams.get("lat"));
    const userLon = parseFloat(searchParams.get("lon"));
    const zoomLevel = parseInt(searchParams.get("zoomLevel"));
    const events = searchParams.get("event_ids").split(',').map(Number).filter(n => !isNaN(n));

    const earthRadius = 6371;
    const maxDistance = zoomLevel < 10 ? 5000 : 500; 
    const minLat = userLat - maxDistance / earthRadius * 180 / Math.PI;
    const maxLat = userLat + maxDistance / earthRadius * 180 / Math.PI;
    const deltaLng = maxDistance / earthRadius / Math.cos(userLat * Math.PI / 180) * 180 / Math.PI;
    const minLng = userLon - deltaLng;
    const maxLng = userLon + deltaLng;
    
    let eventIds = events.join(',');
      
    const query = `
      SELECT * FROM "event"
      WHERE position_lat > $1
        AND position_lat < $2
        AND position_lng > $3
        AND position_lng < $4
        AND id NOT IN (${eventIds})
    AND (
      ("start" IS NULL AND "end" IS NULL)
      OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
      OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
      OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
    )
      ORDER BY 
        (position_lat - $5) * (position_lat - $5) + 
        (position_lng - $6) * (position_lng - $6)
      LIMIT 50
    `;

    const result = await sql.query(query, [
      minLat,
      maxLat,
      minLng,
      maxLng,
      userLat,
      userLon,
    ]);

    eventIds = result.rows.map(event => event.id);

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}