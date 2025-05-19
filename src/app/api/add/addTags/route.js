import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export async function POST(request) {
  const client = await connectToDatabase();

  const cookies = cookie.parse(request.headers.get('cookies') || '');
  const token = cookies.session;
  let authId;
  
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    authId = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  const { eventId, data } = await request.json()

  const checkEventQuery = await client.query(
    'SELECT * FROM event WHERE id = $1 AND author = $2',
    [eventId, authId]
  );
  if (checkEventQuery.rows.length === 0) {
    return NextResponse.json({ result: "ko", message: "Event not found or not yours" });
  }

  try {
    for (const tag of data) {
      const insertUserQuery = await client.query(`
        INSERT INTO event_tags (event_id, tag_id)
        SELECT $1, id FROM tags WHERE tag = $2
      `, [eventId, tag.name]);
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

