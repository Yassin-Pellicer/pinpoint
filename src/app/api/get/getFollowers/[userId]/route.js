import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../utils/db/db";

export async function GET(_request, { params }) {
  const client = await connectToDatabase();
  try {
    const { userId } = params;
    const query = await client.query(
      'SELECT id, "profilePicture", username, description FROM "user" WHERE id IN (SELECT follower FROM followers WHERE followed = $1)',
      [userId]
    );
    return NextResponse.json({ followers: Array.isArray(query.rows) ? query.rows : [query.rows] });
  } catch (error) {
    console.log('Database query error:', error);
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}


