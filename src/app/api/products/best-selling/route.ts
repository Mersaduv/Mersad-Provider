import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/products/best-selling - Get best selling products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        bestSelling: true,
      },
      include: {
        category: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
                level: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to 10 best selling products
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching best selling products:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت پرفروش‌ترین محصولات' },
      { status: 500 }
    )
  }
}
