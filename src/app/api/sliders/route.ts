import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sliders = await prisma.slider.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(sliders);
  } catch (error) {
    console.error("Error fetching sliders:", error);
    return NextResponse.json(
      { error: "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, link, imageUrl, order } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "ImageUrl is required" },
        { status: 400 }
      );
    }

    const slider = await prisma.slider.create({
      data: {
        title,
        link: link || null,
        imageUrl,
        order: order || 0,
      },
    });

    return NextResponse.json(slider, { status: 201 });
  } catch (error) {
    console.error("Error creating slider:", error);
    return NextResponse.json(
      { error: "Failed to create slider" },
      { status: 500 }
    );
  }
}
