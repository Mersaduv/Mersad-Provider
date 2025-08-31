import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, values, categoryId } = body;

    if (!name || !values || !categoryId || !Array.isArray(values) || values.length === 0) {
      return NextResponse.json(
        { error: "Name, values array, and categoryId are required" },
        { status: 400 }
      );
    }

    // Filter out empty values
    const filteredValues = values.filter(v => v && v.trim());

    if (filteredValues.length === 0) {
      return NextResponse.json(
        { error: "At least one non-empty value is required" },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const attribute = await prisma.attribute.update({
      where: { id },
      data: {
        name,
        values: filteredValues,
        categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(attribute);
  } catch (error) {
    console.error("Error updating attribute:", error);
    return NextResponse.json(
      { error: "Failed to update attribute" },
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
    
    await prisma.attribute.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Attribute deleted successfully" });
  } catch (error) {
    console.error("Error deleting attribute:", error);
    return NextResponse.json(
      { error: "Failed to delete attribute" },
      { status: 500 }
    );
  }
}
