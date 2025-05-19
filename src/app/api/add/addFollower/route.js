import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from 'cookie';

export async function POST(request) {
  const { followed } = await request.json();
  const cookies = cookie.parse(request.headers.get("cookie") || "");
  const token = cookies.session;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    follower = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  let follower;

  const client = await connectToDatabase();

  try {
    await client.query(
      "INSERT INTO followers (follower, followed) VALUES ($1, $2)",
      [follower, followed]
    );
    return NextResponse.json({ result: "ok" });
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  } finally {
    client.release(); // This is critical
  }
}
