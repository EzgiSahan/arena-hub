import { NextResponse } from "next/server";
import connectMongoDB from "../../../../lib/mongodb.js";
import Matches from "@/models/matches.js";
import MatchPlayers from "@/models/matchPlayers.js";
import Users from "@/models/users.js";

export async function PUT(request, { params }) {
    const { id } = params;
    const { team1_score, team2_score } = await request.json();
    console.log(id, team1_score, team2_score);
    await connectMongoDB();
    const updatedMatch = await Matches.findByIdAndUpdate({_id: id}, { team1_score: team1_score, team2_score: team2_score });
    return NextResponse.json({ message: "Match Updated", match: updatedMatch }, { status: 200 });
}

export async function PATCH(request, { params }) {
    const { id } = params; 
    const updates = await request.json(); 
    console.log(id, updates);
  
    await connectMongoDB();
  
    try {
      const updatedMatch = await Matches.findByIdAndUpdate(
        { _id: id },
        { $set: updates },
        { new: true }
      );
      if (!updatedMatch) {
        return NextResponse.json(
          { message: "Match not found!" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Match Updated", match: updatedMatch },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating match:", error);
      return NextResponse.json(
        { message: "Failed to update match!" },
        { status: 500 }
      );
    }
}
  

export async function GET(request, { params }) {
    const { id } = params;
    console.log("User id: ", id)
    await connectMongoDB();
    
    try {
        const userMatches = await MatchPlayers.find({ user_id: id }).populate({
                path: "match_id",
                model: Matches,
              })               
        return NextResponse.json({ userMatches });
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching match and player data", error },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        await connectMongoDB();

        const match = await Matches.findById(id);
        if (!match) {
            return NextResponse.json({ message: "Match not found" }, { status: 404 });
        }

        await MatchPlayers.deleteMany({ match_id: id });

        await Matches.findByIdAndDelete(id);
        return NextResponse.json({ message: "Match and related players deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting match:", error);
        return NextResponse.json({ message: "Failed to delete match" }, { status: 500 });
    }
}