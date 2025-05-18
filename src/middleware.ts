import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode("secret");

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ auth: false }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log(payload.id);
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.json({ auth: false }, { status: 401 });
  }
}
