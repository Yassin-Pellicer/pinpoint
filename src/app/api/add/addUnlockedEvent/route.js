import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const {userId, password} = await request.json();
  const client = await connectToDatabase();

  try {
    const query = await client.query(
      'SELECT event, password FROM locked_event WHERE password = $1',
      [password]
    );

    if (query.rows.length === 0) {
      return NextResponse.json({ result: "error", message: "Invalid password" });
    }

    const event = query.rows[0].event;
    await client.query(
      'INSERT INTO unlocked_event (event, "user", password) VALUES ($1, $2, $3)',
      [event, userId, password]
    );

    console.log(`Event ${event} unlocked for user ${userId}`);
    return NextResponse.json({ result: "ok" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: "error", message: error.message });
  } finally {
    client.release(); // This is critical
  }
}
