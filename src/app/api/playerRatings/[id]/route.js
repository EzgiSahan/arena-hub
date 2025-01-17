import connectMongoDB from "../../../../lib/mongodb.js";
import PlayerRatings from "../../../../models/playerRatings.js";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const rated_by_user_id = searchParams.get('rated_by_user_id');
    const match_id = searchParams.get('match_id');
  
    await connectMongoDB();
  
    if (!rated_by_user_id && !match_id) {
      return new Response(
        JSON.stringify({ message: 'Match ID is required' }),
        { status: 400 }
      );
    }
  
    try {
      const ratings = await PlayerRatings.find({ rated_by_user_id: rated_by_user_id, match_id: match_id});
      return new Response(JSON.stringify(ratings), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Error fetching ratings' }), {
        status: 500,
      });
    }
  }
