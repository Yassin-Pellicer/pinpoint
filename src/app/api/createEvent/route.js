import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, description, marker, banner, qr, isPublic, author, enableComments, enableRatings } = await request.json()

  if (!name) {
    return NextResponse.json({ result: "error", message: "name", status: 400 });
  }

  if (!marker) {
    return NextResponse.json({ result: "error", message: "marker", status: 400 });
  }

  let address = "";
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${marker.position[0]}&lon=${marker.position[1]}`
    );
    const data = await response.json();
    const road = data.address.road || "";
    const houseNumber = data.address.house_number || "";
    address = houseNumber ? `${road}, nº: ${houseNumber}` : road;
  } catch (error) {
    console.error("Error fetching street name:", error);
  }

  try {
    const insertUserQuery = await sql`
        INSERT INTO event (name, description, position_lat, position_lng, banner, qr, ispublic, author, "enableRatings", "enableComments", address)
        VALUES (${name}, ${description}, ${marker.position[0]}, ${marker.position[1]}, ${banner}, ${qr}, ${isPublic}, ${author}, ${enableRatings}, ${enableComments}, ${address})
        RETURNING id
      `;
    const insertedId = insertUserQuery.rows[0].id;
    return NextResponse.json({ result: "ok", id: insertedId })
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ result: "" })
  }
}

