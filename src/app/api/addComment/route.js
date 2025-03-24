import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { eventId, userId, comment } = await request.json()

  try {
      const insertUserQuery = await sql`
      INSERT INTO comment (content, "user", posted_at, assign_rating, event)
      VALUES (${comment.content}, ${userId}, CURRENT_TIMESTAMP, ${comment.assignRating}, ${eventId})
    `;
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}
