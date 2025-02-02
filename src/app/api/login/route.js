import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export async function POST(request) {
  const { email, password, remember } = await request.json();

  try {
    const query = await sql`SELECT * FROM "user" WHERE "email" = ${email}`;

    if (query.rows.length === 0) {
      return NextResponse.json({ result: "wrong" });
    }

    const user = query.rows[0];
    const hashedPassword = user.password;
    const username = user.username;

    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
          email: email,
          username: username,
        },
        'secret'
      );

      const serializedCookie = cookie.serialize('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24, 
        path: "/",
      });

      const res = NextResponse.json({ result: "ok" });
      res.headers.set('Set-Cookie', serializedCookie);
      return res;
    }

    return NextResponse.json({ result: "wrong" });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ result: "ko" });
  }
}
