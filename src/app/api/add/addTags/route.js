import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { eventId, data } = await request.json()

  try {
    for (const tag of data) {
      const insertUserQuery = await sql`
        INSERT INTO event_tags (event_id, tag_id)
        SELECT ${eventId}, id FROM tags WHERE tag = ${tag.name}
      `;
    }
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}

