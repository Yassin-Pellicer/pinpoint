import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    let {
      id,
      name,
      description,
      marker,
      banner,
      qr,
      isPublic,
      author,
      enableComments,
      enableRatings,
      enableInscription,
      capacity,
      start,
      end,
      date,
      tags,
    } = await request.json();

    if (!name) {
      return NextResponse.json({
        result: "error",
        message: "name",
        status: 400,
      });
    }

    if (!marker) {
      return NextResponse.json({
        result: "error",
        message: "marker",
        status: 400,
      });
    }

    start = start ? new Date(start).toISOString() : new Date().toISOString();
    end = end ? new Date(end).toISOString() : null;

    if (capacity === 0) {
      capacity = null;
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

    if (id) {
      const checkIdQuery = await sql`SELECT id FROM event WHERE id = ${id}`;
      console.log("Event updated:", id);
      if (checkIdQuery.rowCount > 0) {
        await sql`
          UPDATE event 
          SET 
            name = ${name},
            description = ${description},
            position_lat = ${marker.position[0]},
            position_lng = ${marker.position[1]},
            banner = ${banner},
            qr = ${qr},
            "isPublic" = ${isPublic},
            author = ${author},
            "enableRatings" = ${enableRatings},
            "enableComments" = ${enableComments},
            "enableInscription" = ${enableInscription},
            capacity = ${capacity},
            address = ${address},
            start = ${start},
            "end" = ${end},
            date = ${date},
            creationtime = NOW()
          WHERE id = ${id}
        `;
        console.log("Event updated:", id);
        await sql`
          DELETE FROM event_tags WHERE event_id = ${id}
        `;
        console.log("Event updated:", id);
        for (const tag of tags) {
          await sql`
            INSERT INTO event_tags (event_id, tag_id)
            SELECT ${id}, id FROM tags WHERE tag = ${tag.name}
          `;
        }

        console.log("Event updated:", id);

        return NextResponse.json({id, result: "ok"});
      }
    }

    // If `id` doesn't exist or is invalid, insert a new one
    const insertQuery = await sql`
      INSERT INTO event (
        name, description, position_lat, position_lng, 
        banner, qr, "isPublic", author, 
        "enableRatings", "enableComments", "enableInscription", 
        capacity, address, start, "end", date, creationtime
      )
      VALUES (
        ${name}, ${description}, ${marker.position[0]}, ${marker.position[1]},
        ${banner}, ${qr}, ${isPublic}, ${author},
        ${enableRatings}, ${enableComments}, ${enableInscription},
        ${capacity}, ${address}, ${start}, ${end}, ${date}, NOW()
      )
      RETURNING id
    `;

    const insertedId = insertQuery.rows[0].id;

    for (const tag of tags) {
      await sql`
        INSERT INTO event_tags (event_id, tag_id)
        SELECT ${insertedId}, id FROM tags WHERE tag = ${tag.name}
      `;
    }

    return NextResponse.json({ result: "ok", id: insertedId, created: true });
  } catch (error) {
    console.error("Event Operation Error:", error);
    return NextResponse.json({
      result: "error",
      message: "Internal server error",
      status: 500,
    });
  }
}
