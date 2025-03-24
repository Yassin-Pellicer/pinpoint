import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(_request, {params}) {
  try {
    const { id } = params; // Get the dynamic ID from the route
    const query = await sql`
      SELECT *
      FROM "event_tags" WHERE event_id = ${id}`; ;
    const response = NextResponse.json({ result: "ok", tags: query.rows });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
}
