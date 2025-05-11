import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const client = await connectToDatabase();
  try {
    let {
      id,
    } = await request.json();

    if (id) {
      await client.query(
        'DELETE FROM event WHERE id = $1',
        [id]
      );
      return NextResponse.json({ result: "ok", deleted: true });
    }

  } catch (error) {
    return NextResponse.json({
      result: "error",
      message: "Internal server error",
      status: 500,
    });
  }
  finally { 
    client.release(); // This is critical
  }
}

