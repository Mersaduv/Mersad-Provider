import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    })
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت محصولات' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    
    const product = await prisma.product.create({
      data: {
        name: json.name,
        slug: json.slug,
        description: json.description,
        imageUrls: json.imageUrls || [],
        categoryId: json.categoryId,
      },
      include: {
        category: true,
      },
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'خطا در ایجاد محصول' },
      { status: 500 }
    )
  }
}
