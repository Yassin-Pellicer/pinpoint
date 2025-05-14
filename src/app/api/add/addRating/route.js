import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { eventId, id, rating } = await request.json()
  const client = await connectToDatabase();
  try {
    if (rating === 0 || rating === null) {
      const checkUserQuery = await client.query(
        'SELECT * FROM rating WHERE event = $1 AND "user" = $2',
        [eventId, id]
      );
      if (checkUserQuery.rows.length !== 0) {
        const deleteUserQuery = await client.query(
          'DELETE FROM rating WHERE event = $1 AND "user" = $2',
          [eventId, id]
        );
      }
    } else {
      const checkUserQuery = await client.query(
        'SELECT * FROM rating WHERE event = $1 AND "user" = $2',
        [eventId, id]
      );
      if (checkUserQuery.rows.length === 0) {
        const insertUserQuery = await client.query(
          'INSERT INTO rating ("user", rating, event, date) VALUES ($1, $2, $3, NOW())',
          [id, rating, eventId]
        );

        const updateRatingQuery = await client.query(
          'UPDATE event SET rating = (SELECT ROUND(AVG(rating), 2) FROM rating WHERE event = $1) WHERE id = $1',
          [eventId]
        );
      } else {
        const updateUserQuery = await client.query(
          'UPDATE rating SET rating = $1, date = NOW() WHERE event = $2 AND "user" = $3',
          [rating, eventId, id]
        );

        const updateRatingQuery = await client.query(
          'UPDATE event SET rating = (SELECT ROUND(AVG(rating), 2) FROM rating WHERE event = $1) WHERE id = $1',
          [eventId]
        );
      }
    }
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
  finally { 
    client.release(); // This is critical
  }
}

