import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function POST(request) {
  const { eventId, id } = await request.json()
  try {
    const insertUserQuery = await sql`
    DELETE FROM inscription_user
    WHERE "user" = ${id} AND event = ${eventId}
    `;
    const updateEventQuery = await sql`
    UPDATE event
    SET inscriptions = (SELECT COUNT(*) FROM inscription_user WHERE event = ${eventId})
    WHERE id = ${eventId}
    `;
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}
