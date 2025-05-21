import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { eventId, data } = await request.json();

  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ result: "no session token" }, { status: 401 });
  }

  let session;
  try {
    session = jwt.verify(token, process.env.SESSION_SECRET);
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ result: "invalid session" }, { status: 403 });
  }

  const client = await connectToDatabase();

  try {
    const event = await client.query("SELECT author FROM event WHERE id = $1", [
      eventId,
    ]);

    if (event.rows[0]?.author !== session.id) {
      return NextResponse.json({
        result:
          "invalid user. The user that edits the event must be the author",
      });
    }

    await client.query("DELETE FROM checkpoint WHERE event = $1", [eventId]);

    for (const checkpoint of data) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${checkpoint.marker.position[0]}&lon=${checkpoint.marker.position[1]}`
      );
      const geo = await response.json();
      const road = geo.address?.road || "";
      const houseNumber = geo.address?.house_number || "";
      const fullAddress = houseNumber ? `${road}, nº: ${houseNumber}` : road;

      const inserted = await client.query(
        'INSERT INTO checkpoint (name, event, position_lat, position_lng, description, banner, "order", address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [
          checkpoint.name,
          eventId,
          checkpoint.marker.position[0],
          checkpoint.marker.position[1],
          checkpoint.description,
          checkpoint.banner,
          checkpoint.order,
          fullAddress,
        ]
      );

      const checkpointId = inserted.rows[0].id;

      const qrCode = Array(40)
        .fill(null)
        .map(() => Math.random().toString(36)[2])
        .join("");

      await client.query(
        "INSERT INTO qr_checkpoint (checkpoint, code) VALUES ($1, $2)",
        [checkpointId, qrCode]
      );
    }

    return NextResponse.json({ result: "ok" });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ result: "ko" });
  } finally {
    client.release();
  }
}
