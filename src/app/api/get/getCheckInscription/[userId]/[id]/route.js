import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  const userId = parseInt(params.userId);
  const id = parseInt(params.id);

  try {
    const result = await sql`
      SELECT *
      FROM inscription_user 
      WHERE "user" = ${userId} AND event = ${id}
    `;

    return NextResponse.json({ isInscribed: result.rows.length > 0 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
