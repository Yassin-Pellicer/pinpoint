import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  try {
    const { id } = params;
    const query = await sql`
      SELECT *
      FROM "user" 
      WHERE id = ${id}
    `;
    return NextResponse.json({ result: "ok", user: query.rows[0] });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ result: "ko" });
  }
}
