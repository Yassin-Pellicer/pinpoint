import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export async function GET(_request, { params }) {
  try {
    const { id, userId } = params;
    if (typeof id === "undefined" && typeof userId === "undefined") return NextResponse.json({ result: "ko" });
    let query;
    if (id) {
      query = await sql`
        SELECT "user"
        FROM inscription_user
        WHERE event = ${id}
      `;
    } else {
      query = await sql`
        SELECT "event"
        FROM inscription_user
        WHERE "user" = ${userId}
      `;
    }

    return NextResponse.json({
      result: "ok",
      inscriptions: query.rows,
    });
  } catch (error) {
    console.error("GET inscription error:", error);
    return NextResponse.json({ result: "ko" });
  }
}
