import { connectToDatabase } from '../../../../../utils/db/db';
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function GET(_request, { params }) {
  const client = await connectToDatabase();

  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ result: "ok", code: "" });
  }

  try {
    const result = await client.query(
      `SELECT "user" FROM unlocked_event WHERE event = $1`,
      [id]
    );

    return NextResponse.json({ users: Array.isArray(result.rows) ? result.rows : [result.rows] });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { result: "ko", error: error.message },
      { status: 500 }
    );
  } 
  finally { 
    client.release(); // This is critical
  }
}

