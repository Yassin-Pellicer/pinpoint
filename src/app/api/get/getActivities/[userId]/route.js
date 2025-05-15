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

    const queryEvents = await client.query(`
      SELECT e.banner, e.name, e.id as "event", e.creationtime
      FROM event e
      WHERE e.author = $1
      ORDER BY "creationtime" ASC
    `, [userId]);

    const comments = queryComments.rows;
    const ratings = queryRatings.rows;
    const events = queryEvents.rows;

    const activities = [
      ...comments.map((comment) => ({
        ...comment,
        type: "comment",
        activityDate: new Date(comment.posted_at),
      })),
      ...ratings.map((rating) => ({
        ...rating,
        type: "rating",
        activityDate: new Date(rating.posted_at || rating.date),
      })),
      ...events.map((event) => ({
        ...event,
        type: "event",
        activityDate: new Date(event.date || event.posted_at || event.creationtime),
      })),
    ].sort((a, b) => b.activityDate - a.activityDate);

return NextResponse.json({ result: "ok", activities });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ result: "ko" });
  }
  finally { 
    client.release(); // This is critical
  }
}
