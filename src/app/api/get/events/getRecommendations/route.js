import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const userLat = parseFloat(searchParams.get("lat"));
    const userLon = parseFloat(searchParams.get("lon"));

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

    const result = await sql`
      SELECT *
      FROM "event"
      WHERE position_lat > ${minLat}
        AND position_lat < ${maxLat}
        AND position_lng > ${minLng}
        AND position_lng < ${maxLng}
      AND (
        ("start" IS NULL AND "end" IS NULL)
        OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
        OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
        OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
      )
      ORDER BY RANDOM()
      LIMIT 5
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

    return NextResponse.json({ events: eventsWithMarkers });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
