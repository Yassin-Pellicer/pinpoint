import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {

  const body = await request.json();
  const { username, email, id, profilePicture, banner, description, link } = body;

  try {
    if (id) {
      const insertUserQuery = await sql`
        UPDATE "user" 
        SET username = ${username}, profilePicture = ${profilePicture}, banner = ${banner}, email = ${email}, description = ${description}, link = ${link}
        WHERE id = ${id}
      `;
      return NextResponse.json({ result: "ok" });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ result: "user_exists" });
  }
}
