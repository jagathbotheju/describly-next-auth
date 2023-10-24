import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    console.log(name, email, password);

    if (!name || !email || !password) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (exist) return new NextResponse("Email already exist", { status: 400 });
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, hashedPassword },
    });

    return NextResponse.json(name);
  } catch (error: any) {
    throw NextResponse.json("Internal Server Error", { status: 500 });
  }
}
