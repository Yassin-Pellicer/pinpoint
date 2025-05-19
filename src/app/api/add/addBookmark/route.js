import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const { eventId } = await request.json();
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  let id;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    id = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  const client = await connectToDatabase();
  try {
    await client.query(
      'INSERT INTO bookmarks ("user", event) VALUES ($1, $2)', 
      [id, eventId]
    );
    return NextResponse.json({ result: "ok" });

  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release();
  }
}


