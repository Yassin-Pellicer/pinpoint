import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { eventId, data } = await request.json()

  try {
    for (const checkpoint of data) {
      const insertUserQuery = await sql`
      INSERT INTO checkpoint (name, event, position_lat, position_lng, description, banner, "order")
      VALUES (${checkpoint.name}, ${eventId}, ${checkpoint.marker.position[0]}, ${checkpoint.marker.position[1]}, ${checkpoint.description}, ${checkpoint.banner}, ${checkpoint.order})
    `;
    }
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}
