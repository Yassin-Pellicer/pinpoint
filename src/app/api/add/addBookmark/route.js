import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function POST(request) {
  const { eventId, id } = await request.json()
  try {
    const insertUserQuery = await sql`
    INSERT INTO bookmarks ("user", event)
    VALUES (${id}, ${eventId})
    `;
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    return NextResponse.json({ result: "ko" })
  }
}
