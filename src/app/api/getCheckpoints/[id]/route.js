import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(_request, {params}) {
  try {
    const { id } = params;
    console.log(id)
    const query = await sql`
      SELECT *
      FROM "checkpoint" WHERE event = ${id}`; ;
    const response = NextResponse.json({ result: "ok", checkpoints: query.rows });
    console.log(query.rows)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
}
