import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true }, 
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        position: { type: String, enum: ["Forvet", "Orta Saha", "Defans", "Kaleci"] }, 
        average_rating: { type: Number, default: 0 },
        matches_played: { type: Number, default: 0 },
        totalRating: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Users = mongoose.models.Users || mongoose.model("Users", usersSchema);

export default Users;