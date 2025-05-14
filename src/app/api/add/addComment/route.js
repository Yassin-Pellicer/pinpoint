import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { eventId, userId, comment } = await request.json()
  const client = await connectToDatabase();

  try {
      await client.query(`
      INSERT INTO comment (content, "user", posted_at, rating, event, isprivate)
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5)
    `, [comment.content, userId, comment.rating, eventId, comment.isprivate]);
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
  finally { 
    client.release(); 
  }
}
