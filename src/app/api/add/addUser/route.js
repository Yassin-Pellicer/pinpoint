import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function POST(request) {

  const body = await request.json();
  const {id, username, profilePicture, banner, description, link } = body;

  const existingUserQuery = await sql`
    SELECT id FROM "user" WHERE username = ${username} AND id != ${id}
  `;
  if (existingUserQuery.rows.length > 0) {
    return NextResponse.json({ result: "username_exists" });
  }

  try {
    if (id) {
      try {
        const updateUserQuery = await sql`
          UPDATE "user" 
          SET 
            username = ${username}, 
            "profilePicture" = ${profilePicture}, 
            banner = ${banner}, 
            description = ${description}, 
            link = ${link}
          WHERE id = ${id}
          RETURNING *;
        `;
        return NextResponse.json({ result: "ok" });
      } catch (error) {
        return NextResponse.json({ result: "ko", error: error.message });
      }
    }
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
}
