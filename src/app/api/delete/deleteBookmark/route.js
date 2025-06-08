import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function POST(request) {
  const client = await connectToDatabase();
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  let id;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    id = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  const { eventId } = await request.json()
  try {
    await client.query(
      'DELETE FROM bookmarks WHERE "user" = $1 AND event = $2',
      [id, eventId]
    );
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "ko" })
  }
  finally { 
    client.release(); 
  }
}

