import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { commentId } = await request.json()
  try {
      const deleteUserQuery = await sql`
      DELETE FROM comment
      WHERE id = ${commentId} 
    `;
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Delete Comment Error:', error);
    return NextResponse.json({ result: "" })
  }
}

