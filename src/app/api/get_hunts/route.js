import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || 0; 

    const query = await sql`
      SELECT *
      FROM "hunt"
      WHERE "id" > ${id}`;

    const response = NextResponse.json({ result: "ok", hunts: query.rows });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    return response;
  } catch (error) {
    console.error('Hunt Fetch Error:', error);
    return NextResponse.json({ result: "ko" });
  }
}
