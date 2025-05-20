import { connectToDatabase } from "../../../../utils/db/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export async function POST(request) {
  const client = await connectToDatabase();

  const cookies = cookie.parse(request.headers.get("cookie") || "");
  const token = cookies.session;
  let decodedId;

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    decodedId = decoded.id;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ result: "ko", message: "Invalid session" });
  }

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
      code,
    } = await request.json();

    if (author !== decodedId) {
      return NextResponse.json({
        result: "error",
        message:
          "invalid user. The user that edits the event must be the author",
        status: 401,
      });
    }

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
      const checkIdQuery = await client.query(
        "SELECT id FROM event WHERE id = $1",
        [id]
      );
      if (checkIdQuery.rowCount > 0) {
        if (enableInscription) {
          const checkInscriptionsQuery = await client.query(
            "SELECT COUNT(*) FROM inscription_user WHERE event = $1",
            [id]
          );
          const inscriptions = checkInscriptionsQuery.rows[0].count;
          if (capacity && capacity < inscriptions) {
            return NextResponse.json({
              result: "error",
              message: "capacity",
              status: 400,
            });
          }
        } else {
          await client.query("DELETE FROM inscription_user WHERE event = $1", [
            id,
          ]);
        }
        await client.query(
          `
          UPDATE event 
          SET 
            name = $1,
            description = $2,
            position_lat = $3,
            position_lng = $4,
            banner = $5,
            qr = $6,
            "isPublic" = $7,
            author = $8,
            "enableRatings" = $9,
            "enableComments" = $10,
            "enableInscription" = $11,
            capacity = $12,
            address = $13,
            start = $14,
            "end" = $15,
            date = $16,
            creationtime = NOW()
          WHERE id = $17
        `,
          [
            name,
            description,
            marker.position[0],
            marker.position[1],
            banner,
            qr,
            isPublic,
            author,
            enableRatings,
            enableComments,
            enableInscription,
            capacity,
            address,
            start,
            end,
            date,
            id,
          ]
        );
        await client.query(
          `
          DELETE FROM event_tags WHERE event_id = $1
        `,
          [id]
        );
        for (const tag of tags) {
          await client.query(
            `
            INSERT INTO event_tags (event_id, tag_id)
            SELECT $1, id FROM tags WHERE tag = $2
          `,
            [id, tag.name]
          );
        }
        if (isPublic) {
          await client.query(
            `
            DELETE FROM locked_event
            WHERE event = $1
          `,
            [id]
          );
        } else {
          await client.query(
            `
          DELETE FROM locked_event WHERE event = $1
          `,
            [id]
          );
          await client.query(
            `
          INSERT INTO locked_event (event, password)
          VALUES ($1, $2)
          `,
            [id, code]
          );
          await client.query(
            `
              INSERT INTO unlocked_event ("user", event, password)
              VALUES ($1, $2, $3)
            `,
            [author, id, code]
          );
        }
        return NextResponse.json({ id, result: "ok" });
      }
    }
    const insertQuery = await client.query(
      `
      INSERT INTO event (
        name, description, position_lat, position_lng, 
        banner, qr, "isPublic", author, 
        "enableRatings", "enableComments", "enableInscription", 
        capacity, address, start, "end", date, creationtime
      )
      VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11,
        $12, $13, $14, $15, $16, NOW()
      )
      RETURNING id
    `,
      [
        name,
        description,
        marker.position[0],
        marker.position[1],
        banner,
        qr,
        isPublic,
        author,
        enableRatings,
        enableComments,
        enableInscription,
        capacity,
        address,
        start,
        end,
        date,
      ]
    );

    const insertedId = insertQuery.rows[0].id;

    for (const tag of tags) {
      await client.query(
        `
        INSERT INTO event_tags (event_id, tag_id)
        SELECT $1, id FROM tags WHERE tag = $2
      `,
        [insertedId, tag.name]
      );
    }

    if (!isPublic) {
      await client.query(
        `
        INSERT INTO locked_event (event, password)
        VALUES ($1, $2)
      `,
        [insertedId, code]
      );

      await client.query(
        `
        INSERT INTO unlocked_event ("user", event, password)
        VALUES ($1, $2, $3)
      `,
        [author, insertedId, code]
      );
    }

    return NextResponse.json({ result: "ok", id: insertedId, created: true });
  } catch (error) {
    console.error("Event Operation Error:", error);
    return NextResponse.json({
      result: "error",
      message: "Internal server error",
      status: 500,
    });
  } finally {
    client.release(); // This is critical
  }
}

