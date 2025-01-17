import { NextResponse } from "next/server.js";
import connectMongoDB from "../../../lib/mongodb.js";
import PlayerRatings from "../../../models/playerRatings.js";
import Users from "@/models/users.js";

export async function POST(request) {
    const ratings = await request.json();
    console.log("Veritabanında ratings: ", ratings);
    await connectMongoDB();
  
    const newRatings = [];
    const duplicateRatings = [];
  
    for (const rating of ratings) {
      const { match_id, rated_user_id, rated_by_user_id } = rating;
  
      const existingRating = await PlayerRatings.findOne({
        match_id,
        rated_user_id,
        rated_by_user_id,
      });
  
      if (existingRating) {
        duplicateRatings.push({
          message: `You have already rated player ${rated_user_id} in match ${match_id}`,
          existingRating,
        });
      }
      else {
        const newRatingData = { ...rating, hasRated: true };
        const newRating = await PlayerRatings.create(newRatingData);
        newRatings.push(newRating);
      }
      
      const player = await Users.findById({ _id: rated_user_id });
      if (player) {
        const totalRating = (player.totalRating || 0) + rating.rating;
        const matches_played = (player.matches_played || 0) + 1;
        const average_rating = totalRating / matches_played;
  
        await Users.findOneAndUpdate(
          { _id: rated_user_id },
          { $set: { totalRating, matches_played, average_rating } }
        );
      }
    }
  
    if (duplicateRatings.length > 0) {
      return NextResponse.json(
        {
          message: "Some ratings were already submitted.",
          newRatings,
          duplicateRatings,
        },
        { status: 200 }
      );
    }
  
    return NextResponse.json(
      { message: "Ratings Added", ratings: newRatings },
      { status: 201 }
    );
  }
  

  export async function GET(request) {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const match_id = searchParams.get('match_id');
    const rated_by_user_id = searchParams.get('rated_by_user_id');

    // Sorgu filtresi oluştur
    const filter = {};
    if (match_id) filter.match_id = match_id;
    if (rated_by_user_id) filter.rated_by_user_id = rated_by_user_id;

    const users = await PlayerRatings.find(filter);
    return NextResponse.json({ users });
}

export async function DELETE(request) {
    await connectMongoDB();
    await PlayerRatings.deleteMany();
    return NextResponse.json({ message: "All Ratings Deleted" }, { status: 200 });
}