import mongoose, { Schema } from "mongoose";

const matchesSchema = new Schema(
    {
        match_date: { type: Date, required: true },
        created_by: { type: Schema.Types.ObjectId, ref: "Users", required: true }, 
        team1_score: { type: Number, default: 0 },
        team2_score: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Matches = mongoose.models.Matches || mongoose.model("Matches", matchesSchema);

export default Matches;
