import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function POST(request) {
  const client = await connectToDatabase();
  const { eventId, id } = await request.json()
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
    client.release(); // This is critical
  }
}
