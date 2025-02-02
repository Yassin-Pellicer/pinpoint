import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken'; // Correct import from 'jsonwebtoken'
import cookie from 'cookie'; // Import the cookie package

export async function POST(request) {
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ result: "ko" });
  }

  try {
    verify(sessionCookie, 'secret');

    const serializedCookie = cookie.serialize('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict',
      maxAge: 0,
      path: "/",
    });

    const res = NextResponse.json({ result: "ok" });
    res.headers.set('Set-Cookie', serializedCookie); 
    return res;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ result: "wrong" });
  }
}
