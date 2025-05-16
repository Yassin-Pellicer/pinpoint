import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../../utils/db/db";

export async function GET(_request, { params }) {
  const client = await connectToDatabase();
  try {
    const { userId } = params;
    const query = await client.query(
      'SELECT * FROM "user" WHERE id IN (SELECT * FROM followers WHERE followed = $1)',
      [userId]
    );
    return NextResponse.json({ followers: query.rows[0] });
  } catch (error) {
    console.log('Database query error:', error);
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}


