"use server";
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function GET(request) {
  const cookie = request.cookies.get('session')?.value

  if (!cookie) {
    return NextResponse.json({ auth: false });
  }

  try {
    const user = verify(cookie, "secret"); 
    return NextResponse.json({ auth: true, user: user });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ auth: false });
  }
}
