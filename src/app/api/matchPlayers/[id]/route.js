import { NextResponse } from "next/server";
import connectMongoDB from "../../../../lib/mongodb.js";
import MatchPlayers from "../../../../models/matchPlayers.js";

export async function GET(request, { params }) {
    const { id } = params;
    await connectMongoDB();
    const players = await MatchPlayers.find({ match_id: id });
    return NextResponse.json({ players });
}

export async function DELETE(request, { params }) {
    const { id } = params;
    await connectMongoDB();
    await MatchPlayers.findByIdAndDelete({_id: id});
    return NextResponse.json({ message: "Player Removed from Match" }, { status: 200 });
}