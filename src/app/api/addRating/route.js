import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { eventId, id, rating } = await request.json()
  try {
    if (rating === 0) {
      const checkUserQuery = await sql`
        SELECT * FROM rating 
        WHERE event = ${eventId} AND "user" = ${id}
      `;
      if (checkUserQuery.rows.length !== 0) {
        const deleteUserQuery = await sql`
          DELETE FROM rating 
          WHERE event = ${eventId} AND "user" = ${id}
        `;
      }
    } else {
      const checkUserQuery = await sql`
        SELECT * FROM rating 
        WHERE event = ${eventId} AND "user" = ${id}
      `;
      if (checkUserQuery.rows.length === 0) {
        const insertUserQuery = await sql`
          INSERT INTO rating ("user", rating, event)
          VALUES (${id}, ${rating}, ${eventId})
        `;
      } else {
        const updateUserQuery = await sql`
          UPDATE rating
          SET rating = ${rating}
          WHERE event = ${eventId} AND "user" = ${id}
        `;
      }
    }
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}
