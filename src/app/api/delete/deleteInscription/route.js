import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const client = await connectToDatabase();
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  let authId;
  
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    authId = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  const { eventId, id } = await request.json()

  const checkEventQuery = await client.query(
    'SELECT author FROM event WHERE id = $1',
    [eventId]
  );
  if (checkEventQuery.rows.length === 0 || checkEventQuery.rows[0].author != authId) {
    return NextResponse.json({ result: "ko", message: "Event not found or not yours" });
  }

  try {
    await client.query(
      'DELETE FROM inscription_user WHERE "user" = $1 AND event = $2',
      [id, eventId]
    );
    await client.query(
      'UPDATE event SET inscriptions = (SELECT COUNT(*) FROM inscription_user WHERE event = $1) WHERE id = $1',
      [eventId]
    );
    return NextResponse.json({ result: "ok" });
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" });
  } 
  finally { 
    client.release();
  }
}

