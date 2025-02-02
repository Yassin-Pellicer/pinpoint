import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const id = request.nextUrl.searchParams.get('id');

  try {
    const query = await sql`SELECT * FROM "checkpoint" WHERE "hunt" = ${id} ORDER BY "order" ASC`;
    return NextResponse.json({ result: "ok", checkpoints: query.rows });
  } catch (error) {
    console.error('Checkpoint Fetch Error:', error);
    return NextResponse.json({ result: "ko" });
  }
}
