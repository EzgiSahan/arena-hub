import { NextResponse } from "next/server.js";
import connectMongoDB from "../../../lib/mongodb.js";
import MatchPlayers from "../../../models/matchPlayers.js";

export async function POST(request) {
    const players = await request.json();
    await connectMongoDB();

    const newPlayers = await MatchPlayers.insertMany(players);

    return NextResponse.json({ message: "Players Added to Match" }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const users = await MatchPlayers.find();
    return NextResponse.json({users});
}
