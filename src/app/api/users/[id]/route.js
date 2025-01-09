import { NextResponse } from "next/server";
import Users from "../../../../models/users.js";
import connectMongoDB from "../../../../lib/mongodb.js";

export async function PUT(request, { params }) {
    const { id } = params;
    const { newPosition: position } = await request.json();
    await connectMongoDB();
    await Users.findByIdAndUpdate(id, {position});
    return NextResponse.json({ message: "User Updated "}, { status: 200 });
}

export async function GET(request, { params }) {
    const { id } = params;
    await connectMongoDB();
    const user = await Users.findOne({ _id: id });
    return NextResponse.json({ user }, { status: 200 })
}

export async function DELETE(request, { params }) {
    const { id } = params;
    await connectMongoDB();
    await Users.findByIdAndDelete({_id: id});
    return NextResponse.json({ message: "User Deleted" }, { status: 200 });
}