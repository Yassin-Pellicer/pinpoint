import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { eventId, data } = await request.json()

  try {
    for (const checkpoint of data) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${checkpoint.marker.position[0]}&lon=${checkpoint.marker.position[1]}`
      );
      const data = await response.json();
      const road = data.address.road || "";
      const houseNumber = data.address.house_number || "";
      const fullAddress = houseNumber ? `${road}, nº: ${houseNumber}` : road;

      const insertUserQuery = await sql`
      INSERT INTO checkpoint (name, event, position_lat, position_lng, description, banner, "order", address)
      VALUES (${checkpoint.name}, ${eventId.id}, ${checkpoint.marker.position[0]}, ${checkpoint.marker.position[1]}, ${checkpoint.description}, ${checkpoint.banner}, ${checkpoint.order}, ${fullAddress})
    `;
    }
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}

