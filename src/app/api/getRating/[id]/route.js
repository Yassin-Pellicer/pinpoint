import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function GET(_request, { params }) {
  try {
    const { id } = params;
    
    const query = await sql`
      SELECT ROUND(AVG(rating), 2) AS avg_rating
      FROM "rating"
      WHERE event = ${id}`;

    const response = NextResponse.json({ result: "ok", rating: query.rows[0].avg_rating });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache'); 
    response.headers.set('Expires', '0'); 
    
    return response;
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ result: "ko" });
  }
}
