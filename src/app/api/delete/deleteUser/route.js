import { connectToDatabase } from "../../../../../../utils/db/db";
import { NextResponse } from "next/server";
import cookie from 'cookie';

export async function POST(request) {
  const client = await connectToDatabase();
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.session;
  try {
    let id;

    if (token) {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET);
      id = decoded.id;
    }

    if (id) {
      const deleteUserQuery = await client.query(
        'DELETE FROM "user" WHERE id = $1',
        [id]
      );
      return NextResponse.json({ result: "ok", deleted: true }, {
        headers: {
          'Set-Cookie': cookie.serialize('session', '', {
            path: '/',
            httpOnly: true,
            expires: new Date(0),
          }),
        },
      });
    }

  } catch (error) {
    return NextResponse.json({
      result: "error",
      message: "Internal server error",
      status: 500,
    });
  }
  finally { 
    client.release(); // This is critical
  }
}

