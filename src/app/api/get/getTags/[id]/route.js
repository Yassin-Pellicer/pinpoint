import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../utils/db/db";

export async function GET(_request, { params }) {
  const client = await connectToDatabase();
  try {
    const { id } = params;
    const query = await client.query(
      'SELECT * FROM "event_tags" WHERE event_id = $1',
      [id]
    );
    const response = NextResponse.json({ result: "ok", tags: query.rows });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}

