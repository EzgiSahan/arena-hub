import { NextResponse } from "next/server.js";
import connectMongoDB from "../../../lib/mongodb.js";
import Matches from "../../../models/matches.js";

export async function POST(request) {
    const { match_date, created_by } = await request.json();
    await connectMongoDB();
    const newMatch = await Matches.create({ match_date, created_by });
    return NextResponse.json({ message: "Match Created", match: newMatch }, { status: 201 });
}

export async function GET() {
    await connectMongoDB();
    const matches = await Matches.find();
    return NextResponse.json({ matches });
}
