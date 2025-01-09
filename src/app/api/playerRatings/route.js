import { NextResponse } from "next/server.js";
import connectMongoDB from "../../../lib/mongodb.js";
import PlayerRatings from "../../../models/playerRatings.js";

export async function POST(request) {
    const { match_id, rated_user_id, rated_by_user_id, rating } = await request.json();
    await connectMongoDB();
    const newRating = await PlayerRatings.create({ match_id, rated_user_id, rated_by_user_id, rating });
    return NextResponse.json({ message: "Rating Added", rating: newRating }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const users = await PlayerRatings.find();
    return NextResponse.json({users});
}