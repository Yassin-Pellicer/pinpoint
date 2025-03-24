import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  try {
    const { id } = params;
    const query = await sql`
      SELECT *
      FROM "comment" 
      WHERE event = ${id}
      ORDER BY "posted_at" ASC
    `;
    return NextResponse.json({ result: "ok", comments: query.rows });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ result: "ko" });
  }
}
