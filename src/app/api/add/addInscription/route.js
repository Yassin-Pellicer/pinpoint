import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function POST(request) {
  const client = await connectToDatabase();

  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    follower = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  const { eventId, id } = await request.json()
  try {
    const checkUserQuery = await client.query(
      'SELECT inscriptions, capacity FROM event WHERE id = $1',
      [eventId]
    );
    const inscriptions = checkUserQuery.rows[0].inscriptions;
    const capacity = checkUserQuery.rows[0].capacity;
    if (inscriptions >= capacity && capacity != null) {
      return NextResponse.json({ result: "error", message: "full", status: 400 });
    }
    await client.query(
      'INSERT INTO inscription_user ("user", event) VALUES ($1, $2)',
      [id, eventId]
    );
    await client.query(
      'UPDATE event SET inscriptions = (SELECT COUNT(*) FROM inscription_user WHERE event = $1) WHERE id = $1',
      [eventId]
    );
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  } 
  finally { 
    client.release(); // This is critical
  }
}

