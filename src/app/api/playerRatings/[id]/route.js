import connectMongoDB from "../../../../lib/mongodb.js";
import PlayerRatings from "../../../../models/playerRatings";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { user_id } = params;
    await connectMongoDB();
    const ratings = await PlayerRatings.find({ rated_user_id: user_id });
    return NextResponse.json({ ratings });
}

export async function DELETE(request, { params }) {
    const { id } = params,
    await connectMongoDB();
    await PlayerRatings.findByIdAndDelete({_id: id});
    return NextResponse.json({ message: "Rating Deleted" }, { status: 200 });
}