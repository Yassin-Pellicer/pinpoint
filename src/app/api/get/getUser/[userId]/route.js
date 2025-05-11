import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../utils/db/db";

export async function GET(_request, { params }) {
  const client = await connectToDatabase();
  try {
    const { userId } = params;
    const query = await client.query(
      'SELECT id, username, email, "profilePicture", followers, following, description, banner, link, "memberSince" FROM "user" WHERE id = $1',
      [userId]
    );
    return NextResponse.json({ user: query.rows[0] });
  } catch (error) {
    console.log('Database query error:', error);
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}


