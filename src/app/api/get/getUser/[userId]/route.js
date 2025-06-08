import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../utils/db/db";

export async function GET(_request, { params }) {
  const client = await connectToDatabase();
  try {
    const { userId } = params;
    const query = await client.query(
      'SELECT id, username, email, "profilePicture", (SELECT COUNT(*) FROM followers WHERE followed = $1) as followers, (SELECT COUNT(*) FROM followers WHERE follower = $1) as following, description, banner, link, "memberSince" FROM "user" WHERE id = $1',
      [userId]
    );
    return NextResponse.json({ user: query.rows[0] });
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); 
  }
}


