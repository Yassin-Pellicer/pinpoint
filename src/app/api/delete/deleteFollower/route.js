import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { followed, follower } = await request.json();
  const client = await connectToDatabase();
  try {
    await client.query(
      'DELETE FROM followers WHERE follower = $1 AND followed = $2', 
    [follower, followed]);
    return NextResponse.json({ result: "ok" });

  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}


