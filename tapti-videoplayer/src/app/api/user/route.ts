import { prisma } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check for missing fields in the request body
    if (!body.name || !body.email) {
      return NextResponse.json(
        { message: "Name and email are required." },
        { status: 400 }
      );
    }

    // Check if the user already exists with the same email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // Create a new user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password || "", // You should hash the password in real-world use
      },
    });

    return NextResponse.json(
      { message: "User created successfully!", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
