import { NextResponse } from "next/server.js";
import connectMongoDB from "../../../lib/mongodb.js";
import Matches from "../../../models/matches.js";
import Users from "@/models/users.js";
import MatchPlayers from "@/models/matchPlayers.js";

export async function POST(request) {
    const players = await request.json();
    await connectMongoDB();

    const newMatch = await Matches.create(players);
    console.log(newMatch.id);

    return NextResponse.json({ matchId: newMatch.id }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const matches = await Matches.find();
    return NextResponse.json({ matches });
}

export async function DELETE(request) {
    await connectMongoDB();
    await Matches.deleteMany();
    return NextResponse.json({ message: "All Matches Deleted" }, { status: 200 });
}