import { NextResponse } from "next/server";
import Users from "../../../../models/users.js";
import connectMongoDB from "../../../../lib/mongodb.js";

export async function GET(request, { params }) {
    const { email } = params;
    await connectMongoDB();
    const user = await Users.findOne({ email: email });
    return NextResponse.json({ user }, { status: 200 })
}