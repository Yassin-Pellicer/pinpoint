import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const { followed } = await request.json();
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  let follower;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    follower = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  const client = await connectToDatabase();
  try {
    await client.query(
      'DELETE FROM followers WHERE follower = $1 AND followed = $2', 
      [follower, followed]
    );
    return NextResponse.json({ result: "ok" });

  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}

