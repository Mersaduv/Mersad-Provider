import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "شماره تلفن الزامی است" },
        { status: 400 }
      );
    }

    // Validate phone format
    const iranPattern = /^09\d{9}$/;
    const afghanPattern = /^07\d{8}$/;
    
    if (!iranPattern.test(phone) && !afghanPattern.test(phone)) {
      return NextResponse.json(
        { error: "شماره تلفن نامعتبر است" },
        { status: 400 }
      );
    }

    // Find user by phone
    const user = await prisma.user.findFirst({
      where: { phone }
    });

    if (!user) {
      return NextResponse.json(
        { error: "کاربری با این شماره تلفن یافت نشد" },
        { status: 404 }
      );
    }

    // Return user info for frontend sign-in
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });

  } catch (error: any) {
    console.error("Phone login error:", error);
    return NextResponse.json(
      { error: "خطا در ورود" },
      { status: 500 }
    );
  }
}

