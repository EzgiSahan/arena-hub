import mongoose, { Schema } from "mongoose";

const matchPlayersSchema = new Schema(
    {
        match_id: { type: Schema.Types.ObjectId, ref: "Matches", required: true },
        user_id: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        team: { type: Number, required: true, enum: [1, 2] },
        position: { type: String, required: true, enum: ["Forvet", "Orta Saha", "Defans", "Kaleci"] },
    },
    {
        timestamps: true,
    }
);

const MatchPlayers = mongoose.models.MatchPlayers || mongoose.model("MatchPlayers", matchPlayersSchema);

export default MatchPlayers;
