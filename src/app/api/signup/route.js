import { connectToDatabase } from '../../../utils/db/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const client = await connectToDatabase();
  const body = await request.json();
  const { username, email, password } = body;
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    await client.query(
      'INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashPassword],
    );
    return NextResponse.json({ username, email, result: "ok" });

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ result: "user_exists" });
  }
  finally { 
    client.release(); 
  }
}

