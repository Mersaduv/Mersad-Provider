import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            order: true,
            isActive: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            children: true,
            products: true,
            attributes: true,
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { order: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, slug, image, level, order, isActive, parentId } = body;

    if (!name || !description || !slug) {
      return NextResponse.json(
        { error: "Name, description, and slug are required" },
        { status: 400 }
      );
    }

    // If parentId is provided, verify it exists and get its level
    let actualLevel = level || 0;
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
        select: { level: true },
      });
      
      if (!parent) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        );
      }
      
      actualLevel = parent.level + 1;
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug,
        image: image || null,
        level: actualLevel,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        parentId,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            order: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            children: true,
            products: true,
            attributes: true,
          },
        },
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
