import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  const userId = parseInt(params.userId);

  if (isNaN(userId)) {
    return NextResponse.json({ result: "invalid id" }, { status: 400 });
  }

  try {
    const result = await sql`
      SELECT e.*
      FROM event e
      JOIN inscription_user iu ON e.id = iu.event
    `;

    const response = NextResponse.json(
      result && result.rows.length 
        ? { result: "ok", events: result.rows } 
        : { result: "event not found" }
    );

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;

  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ result: "ko", error: error.message }, { status: 500 });
  }
}
