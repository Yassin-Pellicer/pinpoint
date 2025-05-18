import { connectToDatabase } from '../../../../utils/db/db';
import { NextResponse } from 'next/server';

export async function GET(_request) {
  const client = await connectToDatabase();
  try {
    const queryComments = await client.query(`
      SELECT c.*, e.name, e.banner, u.username, u.id as "userId" 
      FROM comment c, event e, "user" u
      WHERE c."user" = u.id AND e.id = c.event AND e."isPublic" = true
      ORDER BY RANDOM()
      LIMIT 10
    `,);

    const queryRatings = await client.query(`
      SELECT r.*, e.name, e.banner, u.username, u.id as "userId"
      FROM rating r, event e, "user" u
      WHERE r."user" = u.id AND e.id = r.event AND e."isPublic" = true
      ORDER BY RANDOM()
      LIMIT 10
    `,);
    const queryEvents = await client.query(`
      SELECT e.banner, e.name, e.id as "event", e.creationtime, u.username, u.id as "userId"
      FROM event e, "user" u
      WHERE e.author = u.id AND e."isPublic" = true
      ORDER BY RANDOM()
      LIMIT 10
    `,)

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
