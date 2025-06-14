import { connectToDatabase } from "../../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export async function GET(request, { params }) {
  console.log("DEBUG: getEventPermission", params, request.headers.get("cookie"));

  const client = await connectToDatabase();

  const cookies = cookie.parse(request.headers.get("cookie") || "");
  const token = cookies.session;

  let userId;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    userId = decoded.id;
  } catch (error) {
    userId = null;
  }

  const eventId = parseInt(params.id);

  try {
    const result = await client.query(
      `SELECT "isPublic" FROM event WHERE id = $1`,
      [eventId]
    );

    if (!result.rows) {
      return NextResponse.json({ result: false });
    } else {
      if (userId) {
        if (result.rows[0].isPublic) {
          return NextResponse.json({ result: true });
        } else {
          const unlockedEventResult = await client.query(
            `SELECT "user" FROM unlocked_event WHERE event = $1 AND "user" = $2`,
            [eventId, userId]
          );
          console.log("DEBUG: unlockedEventResult", unlockedEventResult.rows);
          if (!unlockedEventResult.rows.length > 0) {
            return NextResponse.json({ result: false });
          } else {
            return NextResponse.json({ result: true });
          }
        }
      } else {
        if (result.rows[0].isPublic) {
          return NextResponse.json({ result: true });
        } else {
          return NextResponse.json({ result: false });
        }
      }
    }
  } catch (error) {
    console.error("DEBUG: error", error);
    return NextResponse.json(
      { result: "ko", error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

