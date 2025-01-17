import { NextResponse } from "next/server";
import connectMongoDB from "../../../../lib/mongodb.js";
import MatchPlayers from "../../../../models/matchPlayers.js";
import Matches from "@/models/matches.js";

export async function GET(request, { params }) {
    const { id } = params;
    console.log("Get method match id: ", id);
    try {
        await connectMongoDB();
        const players = await MatchPlayers.find({ match_id: id }).populate("user_id");
        return NextResponse.json({ players }, { status: 200 });
    } catch (error) {
        console.error("Error fetching match players:", error);
        return NextResponse.json({ message: "Failed to fetch match players." }, { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    const { id } = params;
    await connectMongoDB();
    await MatchPlayers.findByIdAndDelete({_id: id});
    return NextResponse.json({ message: "Player Removed from Match" }, { status: 200 });
}

export async function PUT(request, { params }) {
    const { id } = params;
    const { team } = await request.json();
    console.log(id, team);
    await connectMongoDB();
    const updatedMatchPlayer = await MatchPlayers.findByIdAndUpdate({_id: id}, { team: team });
    return NextResponse.json({ message: "Match Player Updated" }, { status: 200 });
}