import { prisma } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcrypt"; // Ensure you install bcrypt via npm

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // Validate password
    const isPasswordValid = (password === user.password); // In a real-world app, use bcrypt for hashing
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // Send a successful response with a token or success message
    return NextResponse.json({ message: "Sign-in successful" });

  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
