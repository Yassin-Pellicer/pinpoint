import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const client = await connectToDatabase();
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  let id;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    id = decoded.id;
  } catch (error) {
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

  const { commentId } = await request.json()

  const checkCommentQuery = await client.query(
    'SELECT "user" FROM comment WHERE id = $1',
    [commentId]
  );
  if (checkCommentQuery.rows.length === 0 || checkCommentQuery.rows[0].user !== id) {
    return NextResponse.json({ result: "ko", message: "Comment not found or not yours" });
  }

  try {
      await client.query(
        'DELETE FROM comment WHERE id = $1',
        [commentId]
      );
    return NextResponse.json({ result: "ok" })

  } catch (error) {
    console.error('Delete Comment Error:', error);
    return NextResponse.json({ result: "" })
  }
  finally { 
    client.release(); 
  }
}

