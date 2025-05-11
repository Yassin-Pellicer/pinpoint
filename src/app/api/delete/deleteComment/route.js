import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const client = await connectToDatabase();
  const { commentId } = await request.json()
  try {
      await client.query(
        'DELETE FROM comment WHERE id = $1',
        [commentId]
      );
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Delete Comment Error:', error);
    return NextResponse.json({ result: "" })
  }
  finally { 
    client.release(); // This is critical
  }
}

