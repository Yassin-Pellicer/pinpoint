import { connectToDatabase } from '../../../../../utils/db/db';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  const client = await connectToDatabase();
  try {
    const { id } = params;
    const query = await client.query(`
      SELECT c.*, u."profilePicture", u.username
      FROM comment c, "user" u 
      WHERE c.event = $1 AND c."user" = u.id
      ORDER BY "posted_at" ASC
    `, [id]);
    return NextResponse.json({ result: "ok", comments: query.rows });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}
