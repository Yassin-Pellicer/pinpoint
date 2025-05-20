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

    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET);
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json({ result: "ko", message: "Invalid session" });
    }

    const checkAuthor = await client.query(
      "SELECT author FROM event WHERE id = $1",
      [id]
    );

    const eventAuthorId = checkAuthor.rows[0].author;

    let query;

    if(eventAuthorId == userId) {
      query = await client.query(
        'SELECT c.* FROM "checkpoint" c WHERE c.event = $1 ORDER BY "order"',
        [id]
      );
    }
    else{
      const checkQR = await client.query(
        "SELECT qr FROM event WHERE id = $1",
        [id]
      );
      const isQR = checkQR.rows[0].qr;
      if (isQR) {
        query = await client.query(
          'SELECT c.* FROM "checkpoint" c WHERE c.event = $1 ORDER BY "order" LIMIT 1',
          [id]
        );
      } else {
        query = await client.query(
          'SELECT c.* FROM "checkpoint" c WHERE c.event = $1 ORDER BY "order"',
          [id]
        );
      }
    }

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

