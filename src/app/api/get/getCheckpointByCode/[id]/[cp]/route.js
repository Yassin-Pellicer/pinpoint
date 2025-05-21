import { connectToDatabase } from "../../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const client = await connectToDatabase();
  try {
    const { cp } = params;

    let query;
    console.log("cp param:", cp);

    query = await client.query(
      'SELECT c.* FROM "checkpoint" c, qr_checkpoint qr WHERE qr.checkpoint = c.id AND qr.code = $1 ORDER BY "order" LIMIT 1',
      [cp]
    );

    const checkpoints = query.rows;
    console.log("Checkpoints:", checkpoints);

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
