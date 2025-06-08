import { connectToDatabase } from "../../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const client = await connectToDatabase();
  const { id, userId } = params;
  const query = await client.query(
    'SELECT rating FROM "rating" WHERE event = $1 AND "user" = $2',
    [id, userId]
  );
  try {
    if (query.rows.length === 0) {
      return NextResponse.json({ result: "ko" });
    }
    const response = NextResponse.json({
      result: "ok",
      rating: query.rows[0].rating,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); 
  }
}
