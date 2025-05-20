import { connectToDatabase } from '../../../../../utils/db/db';
import { NextResponse } from 'next/server';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function GET(request, { params }) {
  const client = await connectToDatabase();
  try {
    const { id } = params;
    const cookies = cookie.parse(request.headers.get('cookie') || '');
    const token = cookies.session;

    let userId;

    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET);
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json({ result: "ko", message: "Invalid session" });
    }

    // Fetch author of the event
    const authorResult = await client.query(
      `SELECT author FROM event WHERE id = $1`,
      [id]
    );

    if (authorResult.rowCount === 0) {
      return NextResponse.json({ result: "ko", message: "Event not found" });
    }

    const eventAuthorId = authorResult.rows[0].author;

    let commentsQuery;

    if (eventAuthorId === userId) {
      commentsQuery = await client.query(
        `
        SELECT c.*, u."profilePicture", u.username
        FROM comment c
        JOIN "user" u ON c."user" = u.id
        WHERE c.event = $1 AND (c.isprivate = true OR c.isprivate = false)
        ORDER BY "posted_at" ASC
        `,
        [id]
      );
    } else {
      commentsQuery = await client.query(
        `
        SELECT c.*, u."profilePicture", u.username
        FROM comment c
        JOIN "user" u ON c."user" = u.id
        WHERE c.event = $1 AND c.isprivate = false
        ORDER BY "posted_at" ASC
        `,
        [id]
      );
    }

    return NextResponse.json({ result: "ok", comments: commentsQuery.rows });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ result: "ko", message: error.message });
  } finally {
    client.release();
  }
}
