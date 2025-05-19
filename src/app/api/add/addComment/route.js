import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export async function POST(request) {
  const { eventId, comment } = await request.json();
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  let userId;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    userId = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  const client = await connectToDatabase();

  try {
    await client.query(`
      INSERT INTO comment (content, "user", posted_at, rating, event, isprivate)
      VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5)
    `, [comment.content, userId, comment.rating, eventId, comment.isprivate]);
    return NextResponse.json({ result: "ok" });

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" });
  } finally { 
    client.release(); 
  }
}

