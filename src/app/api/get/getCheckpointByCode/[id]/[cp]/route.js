import { connectToDatabase } from "../../../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  const client = await connectToDatabase();
  try {
    const { id, cp } = params;

    let query;

    query = await client.query(
      'SELECT c.* FROM "checkpoint" c, qr_checkpoint qr WHERE qr.checkpoint = c.id AND c.event = $1 AND qr.code = $2 ORDER BY "order" LIMIT 1',
      [id, cp]
    );
    const checkpoints = query.rows;

    const response = NextResponse.json({
      result: "ok",
      checkpoints,
    });

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    return response;
  } catch (error) {
    console.error("Error fetching checkpoints:", error);
    return NextResponse.json({ result: "ko" }, { status: 500 });
  } finally {
    client.release();
  }
}

