import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, description, marker, banner, qr, isPublic, author, enableComments, enableRatings } = await request.json()

  if (!name) {
    return NextResponse.json({ result: "error", message: "name", status: 400 });
  }

  if (!marker) {
    return NextResponse.json({ result: "error", message: "marker", status: 400 });
  }

  try {
    const insertUserQuery = await sql`
        INSERT INTO event (name, description, position_lat, position_lng, banner, qr, ispublic, author, "enableRatings", "enableComments")
        VALUES (${name}, ${description}, ${marker.position[0]}, ${marker.position[1]}, ${banner}, ${qr}, ${isPublic}, ${author}, ${enableRatings}, ${enableComments})
        RETURNING id
      `;
    const insertedId = insertUserQuery.rows[0].id;
    return NextResponse.json({ result: "ok", id: insertedId })
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}

