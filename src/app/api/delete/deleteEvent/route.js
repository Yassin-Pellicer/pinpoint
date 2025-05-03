import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    let {
      id,
    } = await request.json();

    if (id) {
      await sql`
        DELETE FROM event WHERE id = ${id}
      `;
      return NextResponse.json({ result: "ok", deleted: true });
    }

  } catch (error) {
    return NextResponse.json({
      result: "error",
      message: "Internal server error",
      status: 500,
    });
  }
}
