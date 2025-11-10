import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      slug,
      image,
      level,
      order,
      isActive,
      parentId,
      showOnHome,
      homeOrder,
    } = body;

    if (!name || !description || !slug) {
      return NextResponse.json(
        { error: "Name, description, and slug are required" },
        { status: 400 }
      );
    }

    // Prevent circular references - check if trying to set parent to self
    if (parentId === id) {
      return NextResponse.json(
        { error: "Category cannot be its own parent" },
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

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        slug,
        image: image || null,
        level: actualLevel,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        parentId,
        showOnHome: showOnHome !== undefined ? Boolean(showOnHome) : undefined,
        homeOrder: homeOrder !== undefined ? Number(homeOrder) || 0 : undefined,
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

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
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
    
    // Check if category has children
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            children: true,
            products: true,
            attributes: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with subcategories. Please delete subcategories first." },
        { status: 400 }
      );
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with products. Please remove or reassign products first." },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
