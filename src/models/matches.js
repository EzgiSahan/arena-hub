import mongoose, { Schema } from "mongoose";

const matchesSchema = new Schema(
    {
        match_date: { type: Date, required: true },
        created_by: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        location: { type: String, required: true },
        match_hour: {type: String },
        team1_score: { type: Number, default: 0 },
        team2_score: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

matchesSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const matchId = this._id;
        await mongoose.model("MatchPlayers").deleteMany({ match_id: matchId });
        next();
    } catch (error) {
        next(error);
    }
});

const Matches = mongoose.models.Matches || mongoose.model("Matches", matchesSchema);

export default Matches;
