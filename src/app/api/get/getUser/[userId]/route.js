import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  try {
    const { userId } = params;
    const query = await sql`
      SELECT id, username, email, "profilePicture", followers, following, description, banner, link, "memberSince"
      FROM "user" 
      WHERE id = ${userId}
    `;
    return NextResponse.json({ user: query.rows[0] });
  } catch (error) {
    console.log('Database query error:', error);
    return NextResponse.json({ result: "ko" });
  }
}


