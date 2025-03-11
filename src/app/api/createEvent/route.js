import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, description, marker, banner, qr, isPublic, author } = await request.json()

  if (!name) {
    return NextResponse.json({ result: "error", message: "name" }, 400);
  }

  if (!marker) {
    return NextResponse.json({ result: "error", message: "marker" }, 400);
  }

  console.log(isPublic)

  try {
    const insertUserQuery = await sql`
        INSERT INTO event (name, description, position_lat, position_lng, banner, qr, ispublic, author)
        VALUES (${name}, ${description}, ${marker.position[0]}, ${marker.position[0]}, ${banner}, ${qr}, ${isPublic}, ${author})
        RETURNING id
      `;
    const insertedId = insertUserQuery.rows[0].id;
    return NextResponse.json({ result: "ok", id: insertedId })
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}

