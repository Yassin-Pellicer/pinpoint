import { connectToDatabase } from "../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(_request, {params}) {
  const client = await connectToDatabase();
  try {
    const { id } = params;
    const query = await client.query(
      'SELECT * FROM "checkpoint" WHERE event = $1 ORDER BY "order"',
      [id]
    );
    const response = NextResponse.json({ result: "ok", checkpoints: query.rows });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}
