import { connectToDatabase, disconnectFromDatabase } from "../../../../../../utils/db/db";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { eventId, data } = await request.json()
  const client = await connectToDatabase();

  try {
    await client.query('DELETE FROM checkpoint WHERE event = $1', [eventId]);

    for (const checkpoint of data) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${checkpoint.marker.position[0]}&lon=${checkpoint.marker.position[1]}`
      );
      const data = await response.json();
      const road = data.address.road || "";
      const houseNumber = data.address.house_number || "";
      const fullAddress = houseNumber ? `${road}, nº: ${houseNumber}` : road;

      await client.query(
        'INSERT INTO checkpoint (name, event, position_lat, position_lng, description, banner, "order", address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [checkpoint.name, eventId, checkpoint.marker.position[0], checkpoint.marker.position[1], checkpoint.description, checkpoint.banner, checkpoint.order, fullAddress]
      );
    }
    return NextResponse.json({ result: "ok" });

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" });
  }
  finally { 
    client.release(); // This is critical
  }
}

