import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/products/newest - Get newest products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
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
      take: 10, // Limit to 10 newest products
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching newest products:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت جدیدترین محصولات' },
      { status: 500 }
    )
  }
}
