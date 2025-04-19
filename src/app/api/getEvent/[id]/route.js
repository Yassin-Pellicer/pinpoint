import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ result: "invalid id" }, { status: 400 });
  }

  try {
    const result = await sql`
      SELECT e.*
      FROM event e
      WHERE e.id = ${id}
    `;

    const response = NextResponse.json(
      result && result.rows.length 
        ? { result: "ok", event: result.rows[0] } 
        : { result: "event not found" }
    );

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;

  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ result: "ko", error: error.message }, { status: 500 });
  }
}
