import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from 'cookie';
import jwt from "jsonwebtoken";

export async function POST(request) {
  const client = await connectToDatabase();
  console.log("[DEBUG] Connected to database");

  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  console.log("[DEBUG] Parsed cookies:", cookies);
  console.log("[DEBUG] Extracted token:", token);

  let authId;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    authId = decoded.id;
    console.log("[DEBUG] Decoded JWT:", decoded);
  } catch (error) {
    console.error("[DEBUG] Invalid session token:", error);
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  const { eventId, id } = await request.json();
  console.log("[DEBUG] Request body:", { eventId, id });
  console.log("[DEBUG] Auth ID:", authId);

  const checkEventQuery = await client.query(
    'SELECT author FROM event WHERE id = $1',
    [eventId]
  );

  const checkAuthor = await client.query(
    'SELECT user FROM inscription_user WHERE "user" = $1 AND event = $2',
    [id, eventId]
  );
  console.log("[DEBUG] checkEventQuery.rows:", checkEventQuery.rows[0].user);

  if (checkAuthor.rows.length === 0) {
    if (checkEventQuery.rows.length === 0 || checkEventQuery.rows[0].author != authId) {
      console.log("[DEBUG] Event not found or does not belong to user");
      return NextResponse.json({ result: "ko", message: "Event not found or not yours" });
    }
  }

  try {
    const deleteQuery = await client.query(
      'DELETE FROM inscription_user WHERE "user" = $1 AND event = $2',
      [id, eventId]
    );
    console.log("[DEBUG] Deleted inscriptions:", deleteQuery.rowCount);

    const updateEventQuery = await client.query(
      'UPDATE event SET inscriptions = (SELECT COUNT(*) FROM inscription_user WHERE event = $1) WHERE id = $1',
      [eventId]
    );
    console.log("[DEBUG] Updated event inscriptions:", updateEventQuery.rowCount);

    return NextResponse.json({ result: "ok" });
  } catch (error) {
    console.error('[DEBUG] Register Error:', error);
    return NextResponse.json({ result: "error" })
  }
}