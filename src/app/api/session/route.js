"use server";
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET(request) {
  const cookie = request.cookies.get('session')?.value

  if (!cookie) {
    return NextResponse.json({ auth: false });
  }

  const id = verify(cookie, process.env.SESSION_SECRET).id;

  try {
    return NextResponse.json({ auth: true, id: id });
  } catch (error) {
    return NextResponse.json({ auth: false });
  }
}
