import { connectToDatabase } from "../../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const client = await connectToDatabase();

  const userId = parseInt(params.userId);
  const id = parseInt(params.id);

  try {
    const result = await client.query(
      'SELECT * FROM bookmarks WHERE "user" = $1 AND event = $2',
      [userId, id]
    );
    return NextResponse.json({ isBookmarked: result.rows.length > 0 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  finally { 
    client.release(); // This is critical
  }
}
