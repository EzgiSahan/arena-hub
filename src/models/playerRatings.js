import mongoose, { Schema } from "mongoose";

const playerRatingsSchema = new Schema(
    {
        match_id: { type: Schema.Types.ObjectId, ref: "Matches", required: true },
        rated_user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true }, 
        rated_by_user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true }, 
        rating: { type: Number, required: true, min: 1, max: 10 }, 
    },
    {
        timestamps: true,
    }
);

const PlayerRatings = mongoose.models.PlayerRatings || mongoose.model("PlayerRatings", playerRatingsSchema);

export default PlayerRatings;
