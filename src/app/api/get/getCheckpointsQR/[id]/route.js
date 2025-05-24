import { connectToDatabase } from "../../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  const client = await connectToDatabase();
  try {
    const { id } = params;
    const cookies = cookie.parse(request.headers.get("cookie") || "");
    const token = cookies.session;

    let userId;
    let query;

    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET);
      userId = decoded.id;
    } catch (error) {}

    const checkAuthor = await client.query(
      "SELECT author FROM event WHERE id = $1",
      [id]
    );

    const eventAuthorId = checkAuthor.rows[0].author;

    const checkQR = await client.query("SELECT qr FROM event WHERE id = $1", [
      id,
    ]);
    const isQR = checkQR.rows[0].qr;
    if (isQR && eventAuthorId == userId) {
      query = await client.query(
        'SELECT c.*, qr.code FROM "checkpoint" c, "qr_checkpoint" qr WHERE c.event = $1 AND qr.checkpoint = c.id ORDER BY c."order"',
        [id]
      );
    }

    const checkpoints = query.rows;

    const response = NextResponse.json({
      result: "ok",
      checkpoints,
    });

    return response;
  } catch (error) {
    console.error("Error fetching checkpoints:", error);
    return NextResponse.json({ result: "ko" }, { status: 500 });
  } finally {
    client.release();
  }
}
