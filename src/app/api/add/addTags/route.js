import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const client = await connectToDatabase();

  const { eventId, data } = await request.json()

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

