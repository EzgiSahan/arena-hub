import { NextResponse } from "next/server";
import connectMongoDB from "../../../../lib/mongodb.js";
import Matches from "../../../../models/matches.js";

export async function PUT(request, { params }) {
    const { id } = params;
    const { newMatchDate: match_date, newTeam1Score: team1_score, newTeam2Score: team2_score } = await request.json();
    await connectMongoDB();
    const updatedMatch = await Matches.findByIdAndUpdate(id, { match_date, team1_score, team2_score });
    return NextResponse.json({ message: "Match Updated", match: updatedMatch }, { status: 200 });
}

export async function DELETE(request, { params }) {
    const { id } = params;
    await connectMongoDB();
    await Matches.findByIdAndDelete({_id: id});
    return NextResponse.json({ message: "Match Deleted" }, { status: 200 });
}