import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    if (
      request.nextUrl.pathname.startsWith("/api/add") ||
      request.nextUrl.pathname.startsWith("/api/delete")
    ) {
      return NextResponse.json({ auth: false }, { status: 401 });
    }
  } else {
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ auth: false }, { status: 401 });
    }
  }

  return NextResponse.next(); 
}
