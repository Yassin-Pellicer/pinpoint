import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export async function POST(request) {

  const { email, password, remember } = await request.json();

  try {
    const query = await sql`SELECT * FROM "user" WHERE "email" = ${email}`;

    const username = query.rows[0];

    if (username === undefined) {
      return NextResponse.json({ result: "user_not_found" });
    }
    
    const hashedPassword = username.password;
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

      const res = NextResponse.json({ result: "user_found" });
      res.headers.set('Set-Cookie', serializedCookie);
      return res;
    }
    else {
      return NextResponse.json({result: "wrong_password"})
    }
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ result: "exception" });
  }
}
