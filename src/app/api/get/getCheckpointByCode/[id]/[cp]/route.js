import { connectToDatabase } from "../../../../../../utils/db/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const client = await connectToDatabase();
  try {
    const { cp } = params;
    
    // Add validation for the cp parameter
    if (!cp) {
      return NextResponse.json({ 
        result: "ko", 
        error: "Missing checkpoint code parameter" 
      }, { status: 400 });
    }
    
    console.log('Searching for checkpoint with code:', cp);
    
    const query = await client.query(
      'SELECT c.* FROM "checkpoint" c INNER JOIN qr_checkpoint qr ON qr.checkpoint = c.id WHERE qr.code = $1 ORDER BY c."order" LIMIT 1',
      [cp]
    );
    
    console.log('Query result rows:', query.rows.length);
    console.log('Query result:', query.rows);
    
    const checkpoints = query.rows;
    
    const response = NextResponse.json({
      result: "ok",
      checkpoints, // Return single checkpoint object
    });
    
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    
    return response;
  } catch (error) {
    console.error("Error fetching checkpoint:", error);
    return NextResponse.json({ 
      result: "ko", 
      error: "Internal server error" 
    }, { status: 500 });
  } finally {
    client.release();
  }
}