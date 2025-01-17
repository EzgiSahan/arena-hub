import { NextResponse } from "next/server.js";
import connectMongoDB from "../../../lib/mongodb.js";
import MatchPlayers from "../../../models/matchPlayers.js";
import Users from "@/models/users.js";

export async function POST(request) {
    const players = await request.json();
    console.log(players);
    await connectMongoDB();

    const newPlayers = players.map((player) => ({
        match_id: player.match_id,
        user_id: player.user_id, 
        position: player.position,
        team: player.team || null,
    }));
    await MatchPlayers.insertMany(newPlayers);

    return NextResponse.json({ message: "Players Added to Match" }, { status: 201 });
}

export async function GET(request) {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const match_id = searchParams.get('match_id');

    const filter = {};
    if (match_id) filter.match_id = match_id;
    const users = await MatchPlayers.find(filter);
    return NextResponse.json({users});
}

export async function DELETE(request) {
    await connectMongoDB();
    await MatchPlayers.deleteMany();
    return NextResponse.json({ message: "All Match Players Deleted" }, { status: 200 });
}
