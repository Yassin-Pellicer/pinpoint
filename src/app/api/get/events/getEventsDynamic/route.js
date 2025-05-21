import { connectToDatabase } from "../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const client = await connectToDatabase();
  try {
    const { searchParams } = new URL(request.url);

    const userLat = parseFloat(searchParams.get("lat"));
    const userLon = parseFloat(searchParams.get("lon"));
    const zoomLevel = parseInt(searchParams.get("zoomLevel"));
    let userId = parseInt(searchParams.get("userId"));
    const events = searchParams
      .get("event_ids")
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));

    if (isNaN(userId)) userId = -1;

    const earthRadius = 6371;
    const maxDistance = zoomLevel < 10 ? 5000 : 500;
    const minLat = userLat - ((maxDistance / earthRadius) * 180) / Math.PI;
    const maxLat = userLat + ((maxDistance / earthRadius) * 180) / Math.PI;
    const deltaLng =
      ((maxDistance / earthRadius / Math.cos((userLat * Math.PI) / 180)) *
        180) /
      Math.PI;
    const minLng = userLon - deltaLng;
    const maxLng = userLon + deltaLng;

    let eventIds = events.join(",");

    const query = `
      SELECT * FROM "event"
      WHERE position_lat > $1
        AND position_lat < $2
        AND position_lng > $3
        AND position_lng < $4
        AND id NOT IN (${eventIds})
        AND ("isPublic" = true
        OR ("isPublic" = false AND id IN (SELECT event FROM unlocked_event WHERE "user" = $5))
        )
      AND (
        ("start" IS NULL AND "end" IS NULL)
        OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
        OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
        OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
      )
      ORDER BY 
        (position_lat - $6) * (position_lat - $6) + 
        (position_lng - $7) * (position_lng - $7)
      LIMIT 50
    `;

    const result = await client.query(query, [
      minLat,
      maxLat,
      minLng,
      maxLng,
      userId,
      userLat,
      userLon,
    ]);

    eventIds = result.rows.map((event) => event.id);

    const tagsQuery = await client.query(
      `SELECT * FROM "event_tags" WHERE event_id = ANY($1)`,
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
    console.error("Database query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
