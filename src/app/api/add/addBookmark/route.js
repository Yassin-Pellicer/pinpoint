import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { eventId, id } = await request.json();
  const client = await connectToDatabase();
  try {
    await client.query(
      'INSERT INTO bookmarks ("user", event) VALUES ($1, $2)', 
    [id, eventId]);
    return NextResponse.json({ result: "ok" });

  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}


