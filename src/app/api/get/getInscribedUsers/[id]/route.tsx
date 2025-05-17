import { connectToDatabase } from "../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(_request, {params}) {
  const client = await connectToDatabase();
  try {
    const { id } = params;
    const query = await client.query(
      'SELECT id, "profilePicture", username, description FROM "user" WHERE id IN (SELECT "user" FROM inscription_user WHERE event = $1)',
      [id]
    );
    const response = NextResponse.json({ result: "ok", inscriptions: Array.isArray(query.rows) ? query.rows : [] });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}
