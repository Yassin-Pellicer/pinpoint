import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { description, difficulty, image, isqr, name, position_lat, position_lng, isPublic } = await request.json()

  try {
    const insertUserQuery = await sql`
        INSERT INTO hunt (description, difficulty, image, isqr, name, position_lat, position_lng, public)
        VALUES (${description}, ${difficulty}, ${image}, ${isqr}, ${name}, ${position_lat}, ${position_lng}, ${isPublic})
        RETURNING id
      `;
    const insertedId = insertUserQuery.rows[0].id;
    return NextResponse.json({ result: "ok", id: insertedId })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}

