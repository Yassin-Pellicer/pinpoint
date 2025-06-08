import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const client = await connectToDatabase();
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  let userId;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    userId = decoded.id;
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  try {
    let { id } = await request.json();

    const checkEventQuery = await client.query(
      'SELECT * FROM event WHERE id = $1 AND author = $2',
      [id, userId]
    );

    if (checkEventQuery.rows.length === 0) {
      console.warn("Event not found or not authorized for user ID:", userId);
      return NextResponse.json({ result: "ko", message: "Event not found or not yours" });
    }

    await client.query(
      'DELETE FROM event WHERE id = $1',
      [id]
    );
    return NextResponse.json({ result: "ok", deleted: true });

  } catch (error) {
    console.error("Error during event deletion:", error);
    return NextResponse.json({
      result: "error",
      message: "Internal server error",
      status: 500,
    });
  } finally {
    client.release(); 
  }
}

