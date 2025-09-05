import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/products/related-categories - Get products from current, parent, and child categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10

    if (!categoryId) {
      return NextResponse.json(
        { error: 'شناسه دسته‌بندی الزامی است' },
        { status: 400 }
      )
    }

    // Get the current category with its parent and children
    const currentCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true
          }
        },
        children: {
          where: { isActive: true },
          select: { id: true }
        }
      }
    })

    if (!currentCategory) {
      return NextResponse.json(
        { error: 'دسته‌بندی یافت نشد' },
        { status: 404 }
      )
    }

    // Collect all category IDs to search in
    const categoryIds = [categoryId] // Current category

    // Add parent category if exists
    if (currentCategory.parent) {
      categoryIds.push(currentCategory.parent.id)
    }

    // Add child categories
    const childCategoryIds = currentCategory.children.map(child => child.id)
    categoryIds.push(...childCategoryIds)

    // Get products from all related categories
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryIds
        }
      },
      include: {
        category: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
                level: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت محصولات مرتبط' },
      { status: 500 }
    )
  }
}
