import { NextResponse } from "next/server.js";
import connectMongoDB from "../../../lib/mongodb.js";
import Users from "../../../models/users.js";
import bcrypt from "bcryptjs";

export async function POST(request) {
    const { email, password, first_name, last_name, position } = await request.json();
    await connectMongoDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.create({ email, password: hashedPassword, first_name, last_name, position });
    return NextResponse.json({message: "User Created"}, {status: 201});
}

export async function GET() {
    await connectMongoDB();
    const users = await Users.find();
    return NextResponse.json({users});
}

export async function DELETE(request) {
    await connectMongoDB();
    await Users.deleteMany();
    return NextResponse.json({ message: "All Users Deleted" }, { status: 200 });
}