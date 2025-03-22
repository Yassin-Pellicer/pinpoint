import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { eventId, id, comment } = await request.json()
  console.log({ eventId, id, comment })

  try {
      const insertUserQuery = await sql`
      INSERT INTO comment (content, "user", posted_at, assign_rating, event)
      VALUES (${comment.content}, ${id}, CURRENT_TIMESTAMP, ${comment.assignRating}, ${eventId})
    `;
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}
