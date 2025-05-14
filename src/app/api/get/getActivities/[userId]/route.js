import { connectToDatabase } from '../../../../../utils/db/db';
import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  const client = await connectToDatabase();
  try {
    const { userId } = params;
    const queryComments = await client.query(`
      SELECT c.*, e.name, e.banner
      FROM comment c, event e
      WHERE c."user" = $1 AND e.id = c.event
      ORDER BY "posted_at" ASC
    `, [userId]);

    const queryRatings = await client.query(`
      SELECT r.*, e.name, e.banner
      FROM rating r, event e
      WHERE r."user" = $1 AND e.id = r.event
      ORDER BY "date" ASC
    `, [userId]);

    const comments = queryComments.rows;
    const ratings = queryRatings.rows;

    const activities = [
      ...comments.map(comment => ({ ...comment, type: "comment" })),
      ...ratings.map(rating => ({ ...rating, type: "rating" }))
    ].sort((a, b) => new Date(b.posted_at || b.date) - new Date(a.posted_at || a.date));
    return NextResponse.json({ result: "ok", activities });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}
