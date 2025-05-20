import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export async function POST(request) {

  const body = await request.json();
  const {id, username, profilePicture, banner, description, link } = body;

  const client = await connectToDatabase();

  const existingUserQuery = await client.query(
    'SELECT id FROM "user" WHERE username = $1 AND id != $2',
    [username, id]
  );
  if (existingUserQuery.rows.length > 0) {
    return NextResponse.json({ result: "username_exists" });
  }

  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  let authId;
  
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    authId = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  try {
    if (id === authId) {
      const updateUserQuery = await client.query(
        'UPDATE "user" SET username = $1, "profilePicture" = $2, banner = $3, description = $4, link = $5 WHERE id = $6 RETURNING *;',
        [username, profilePicture, banner, description, link, id]
      );
      return NextResponse.json({ result: "ok" });
    } else {
      return NextResponse.json({ result: "ko", message: "Unauthorized" });
    }
  } catch (error) {
    return NextResponse.json({ result: "ko", error: error.message });
  } finally {
    client.release();
  }
}
