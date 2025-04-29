import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request, { params }) {
  try {
    const { id, userId } = params;
    const query = await sql`
      SELECT rating
      FROM "rating" 
      WHERE event = ${id} AND "user" = ${userId}`;
    const response = NextResponse.json({
      result: "ok",
      rating: query.rows[0].rating,
    });
    return response;
  } catch (error) {
    return NextResponse.json({ result: "ko" });
  }
}
