import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slider = await prisma.slider.findUnique({
      where: { id },
    });

    if (!slider) {
      return NextResponse.json(
        { error: "Slider not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(slider);
  } catch (error) {
    console.error("Error fetching slider:", error);
    return NextResponse.json(
      { error: "Failed to fetch slider" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, link, imageUrl, order, isActive } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "ImageUrl is required" },
        { status: 400 }
      );
    }

    const slider = await prisma.slider.update({
      where: { id },
      data: {
        title,
        link: link || null,
        imageUrl,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(slider);
  } catch (error) {
    console.error("Error updating slider:", error);
    return NextResponse.json(
      { error: "Failed to update slider" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.slider.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Slider deleted successfully" });
  } catch (error) {
    console.error("Error deleting slider:", error);
    return NextResponse.json(
      { error: "Failed to delete slider" },
      { status: 500 }
    );
  }
}
