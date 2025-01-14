import { prisma } from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    console.log("request to aaya backend me ------------------------------------------------------------------------------------");
    
    try {
      const body = await req.json();
  
      // First check if email or githubUsername already exists?
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: body.email },
          ]
        }
      });
      if (existingUser) {
        return NextResponse.json({
          message: "Email already registered"
        }, { status: 409 }); // 409 Conflict status code
      }
  
  
      // Create a new user in the database with the data (like avatar, bio, followers etc) fetched (just above) from GitHub
      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: body.password,
        },
      });
  
  
      return NextResponse.json({ message: "User created successfully!", user }, { status: 201 });
  
    } catch (error) {
      console.error("Error:", error);
  
      return NextResponse.json(
        { message: "An error occurred while processing your request." },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect(); // Close Prisma Client connection
    }
  }
