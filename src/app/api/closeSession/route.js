import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

export async function POST() {
  const cookieStore = cookies();
  const session = cookieStore.get('session');

  if (!session) {
    return NextResponse.json({ auth: false });
  }

  try {
    verify(session.value, process.env.SESSION_SECRET);

    const response = new NextResponse(JSON.stringify({ auth: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    response.cookies.set('session', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('closeSession error:', error);
    return NextResponse.json({ auth: false });
  }
}
