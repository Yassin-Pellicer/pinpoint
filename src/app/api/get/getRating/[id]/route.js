import { connectToDatabase } from '../../../../../utils/db/db';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  const client = await connectToDatabase();
  try {
    const { id } = params;
    
    const query = await client.query(
      'SELECT ROUND(AVG(rating), 2) AS avg_rating FROM "rating" WHERE event = $1',
      [id]
    );

    const response = NextResponse.json({ result: "ok", rating: query.rows[0].avg_rating });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache'); 
    response.headers.set('Expires', '0'); 
    
    return response;
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); 
  }
}

