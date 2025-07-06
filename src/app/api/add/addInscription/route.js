import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const client = await connectToDatabase();

  const cookies = cookie.parse(request.headers.get("cookie") || "");
  const token = cookies.session;

  let decodedId;
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    decodedId = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  const body = await request.json();
  const { eventId, id: passedId } = body;

  const id = passedId !== undefined && passedId !== null ? passedId : decodedId;

  try {
    const checkVigencia = await client.query(`
      SELECT *
      FROM event
      WHERE (
        ("start" IS NULL AND "end" IS NULL)
        OR ("end" IS NOT NULL AND "start" IS NULL AND "end" > NOW())
        OR ("start" IS NOT NULL AND "end" IS NULL AND "start" < NOW())
        OR ("start" IS NOT NULL AND "end" IS NOT NULL AND "start" <= NOW() AND "end" >= NOW())
      ) AND id = $1
    `, [eventId]);
    if (checkVigencia.rows.length <= 0) {
      return NextResponse.json({
        result: "error",
        message: "out of date",
        status: 400,
      });
    }

    const checkUserQuery = await client.query(
      "SELECT inscriptions, capacity FROM event WHERE id = $1",
      [eventId]
    );
    const inscriptions = checkUserQuery.rows[0].inscriptions;
    const capacity = checkUserQuery.rows[0].capacity;
    if (inscriptions >= capacity && capacity != null) {
      return NextResponse.json({
        result: "error",
        message: "full",
        status: 400,
      });
    }

    // ✅ OPCIONAL: chequea si ya existe para evitar duplicados
    const checkExistingInscription = await client.query(
      'SELECT 1 FROM inscription_user WHERE "user" = $1 AND event = $2',
      [id, eventId]
    );
    if (checkExistingInscription.rows.length > 0) {
      return NextResponse.json({
        result: "error",
        message: "already inscribed",
        status: 400,
      });
    }

    await client.query(
      'INSERT INTO inscription_user ("user", event) VALUES ($1, $2)',
      [id, eventId]
    );
    await client.query(
      "UPDATE event SET inscriptions = (SELECT COUNT(*) FROM inscription_user WHERE event = $1) WHERE id = $1",
      [eventId]
    );
    return NextResponse.json({ result: "ok" });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ result: "" });
  } finally {
    client.release();
  }
}
