import { connectToDatabase } from '../../../../../../utils/db/db';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  const client = await connectToDatabase();

  try {
    const { user, follows } = params;
    console.log(`Checking if ${follows} follows ${user}`);

    const query = await client.query(
      'SELECT 1 FROM followers WHERE follower = $1 AND followed = $2',
      [follows, user]
    );

    return NextResponse.json({
      result: "ok",
      follows: query.rowCount > 0
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ result: "ko", error: error.message });
  } finally {
    client.release(); // Release the database client
  }
}
