import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {

  const body = await request.json();
  const { username, email, password } = body;
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const insertUserQuery = await sql`
      INSERT INTO "user" (username, email, password)
      VALUES (${username}, ${email}, ${hashPassword})
    `;
    return NextResponse.json({ username, email, result: "ok" });

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ result: "error" }, { status: 500 });
  }
}
