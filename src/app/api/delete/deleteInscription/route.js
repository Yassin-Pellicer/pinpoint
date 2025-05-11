import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const client = await connectToDatabase();
  const { eventId, id } = await request.json()
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

