import { NextResponse } from 'next/server';

// Define protected routes
const protectedPaths = ['/api/delete', '/api/add'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('user_token')?.value;

  console.log("AJSNDIUASN DASDOMASod iMASOM AOISMDOIA MSODIMA SDMo")

  // Check if this route requires authentication
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !token) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request
  return NextResponse.next();
}

// Apply middleware only to selected routes
export const config = {
  matcher: [
    '/api/delete/:path*',
    '/api/add/:path*',
  ],
};
