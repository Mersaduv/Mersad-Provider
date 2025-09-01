import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length === 0) {
      return NextResponse.json([])
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive' as any, // For case-insensitive search
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive' as any,
            },
          },
        ],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      take: limit,
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { error: 'خطا در جستجوی محصولات' },
      { status: 500 }
    )
  }
}
