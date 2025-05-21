import { connectToDatabase } from "../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const client = await connectToDatabase();
  try {
    const { searchParams } = new URL(request.url);

    const userLat = parseFloat(searchParams.get("lat"));
    const userLon = parseFloat(searchParams.get("lon"));
    let userId = parseInt(searchParams.get("userId"));
    if (isNaN(userId)) userId = -1;

    if (isNaN(userLat) || isNaN(userLon)) {
      return NextResponse.json(
        { result: "invalid coordinates" },
        { status: 400 }
      );
    }

    const earthRadius = 6371;
    const maxDistance = 10; // in km
    const minLat = userLat - ((maxDistance / earthRadius) * 180) / Math.PI;
    const maxLat = userLat + ((maxDistance / earthRadius) * 180) / Math.PI;
    const deltaLng =
      ((maxDistance / earthRadius / Math.cos((userLat * Math.PI) / 180)) *
        180) /
      Math.PI;
    const minLng = userLon - deltaLng;
    const maxLng = userLon + deltaLng;

    const result = await client.query(
      `
      SELECT *
      FROM "event"
      WHERE position_lat > $1
        AND position_lat < $2
        AND position_lng > $3
        AND position_lng < $4
        AND "isPublic" = true
      AND (
        ("start" IS NULL AND "end" IS NULL)
        OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
        OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
        OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
      )
      ORDER BY RANDOM()
      LIMIT 5
    `,
      [minLat, maxLat, minLng, maxLng]
    );

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release(); // This is critical
  }
}
