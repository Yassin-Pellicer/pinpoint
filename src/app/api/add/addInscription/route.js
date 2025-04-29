import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function POST(request) {
  const { eventId, id } = await request.json()
  try {
    const checkUserQuery = await sql`
    SELECT inscriptions, capacity FROM event
    WHERE id = ${eventId}
    `;
    const inscriptions = checkUserQuery.rows[0].inscriptions;
    const capacity = checkUserQuery.rows[0].capacity;
    if (inscriptions >= capacity && capacity != null) {
      return NextResponse.json({ result: "error", message: "full", status: 400 });
    }
    const insertUserQuery = await sql`
    INSERT INTO inscription_user ("user", event)
    VALUES (${id}, ${eventId})
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
