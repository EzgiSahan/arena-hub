import mongoose, { Schema } from "mongoose";

const playerRatingsSchema = new Schema(
    {
        match_id: { type: Schema.Types.ObjectId, ref: "Matches", required: true },
        rated_user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true }, 
        rated_by_user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true }, 
        rating: { type: Number, required: true, min: 1, max: 10 }, 
        hasRated: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

playerRatingsSchema.index({ match_id: 1, rated_user_id: 1, rated_by_user_id: 1 }, { unique: true }); 


const PlayerRatings = mongoose.models.PlayerRatings || mongoose.model("PlayerRatings", playerRatingsSchema);

export default PlayerRatings;
