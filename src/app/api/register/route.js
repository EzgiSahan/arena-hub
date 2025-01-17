import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../../../models/users";
import connectMongoDB from "../../../lib/mongodb";

export async function POST(request) {
  try {
    const { email, password, first_name, last_name } = await request.json();
    await connectMongoDB();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    const accessToken = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.NEXTAUTH_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        message: "User Created",
        user: {
          id: newUser._id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
        },
        accessToken,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating user", error: error.message },
      { status: 500 }
    );
  }
}
