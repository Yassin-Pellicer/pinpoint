import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { password } = await request.json();
  const cookies = cookie.parse(request.headers.get("cookie") || "");
  const token = cookies.session;
  let userId;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    userId = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "error", message: "Invalid session" });
  }

  const client = await connectToDatabase();

  try {
    const query = await client.query(
      "SELECT event, password FROM locked_event WHERE password = $1",
      [password]
    );

    if (query.rows.length === 0) {
      return NextResponse.json({
        result: "error",
        message: "Invalid password",
      });
    }

    const event = query.rows[0].event;
    await client.query(
      'INSERT INTO unlocked_event (event, "user", password) VALUES ($1, $2, $3)',
      [event, userId, password]
    );

    console.log(`Event ${event} unlocked for user ${userId}`);
    return NextResponse.json({ result: "ok" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: "error", message: error.message });
  } finally {
    client.release();
  }
}
