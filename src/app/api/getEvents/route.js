import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get("tags"); // Expecting comma-separated tag IDs
    const search = searchParams.get("search");

    const query = await sql`
      SELECT *
      FROM "event"`;
    const response = NextResponse.json({ result: "ok", events: query.rows });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
}
