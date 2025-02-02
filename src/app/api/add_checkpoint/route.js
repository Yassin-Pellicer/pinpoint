import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, hunt, position_lat, position_lng, description, image, order } = await request.json()
  console.log({ name, hunt, position_lat, position_lng, description, image, order })

  try {
    const insertUserQuery = await sql`
        INSERT INTO checkpoint (name, hunt, position_lat, position_lng, description, image, "order")
        VALUES (${name}, ${hunt}, ${position_lat}, ${position_lng}, ${description}, ${image}, ${order})
      `;
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}
