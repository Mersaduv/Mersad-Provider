import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/products - Get all products
export async function GET() {
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
    
    // Validate required fields
    if (!json.name || !json.slug || !json.description || !json.categoryId) {
      return NextResponse.json(
        { error: 'تمام فیلدهای اجباری باید پر شوند' },
        { status: 400 }
      )
    }

    // Validate categoryId exists
    const category = await prisma.category.findUnique({
      where: { id: json.categoryId }
    })
    
    if (!category) {
      return NextResponse.json(
        { error: 'دسته‌بندی انتخاب شده یافت نشد' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: json.slug }
    })
    
    if (existingProduct) {
      return NextResponse.json(
        { error: 'نامک (slug) تکراری است' },
        { status: 400 }
      )
    }
    
    const product = await prisma.product.create({
      data: {
        name: json.name,
        slug: json.slug,
        description: json.description,
        imageUrls: json.imageUrls || [],
        categoryId: json.categoryId,
        price: json.price !== undefined ? parseFloat(json.price) : null,
        bestSelling: json.bestSelling !== undefined ? json.bestSelling : false,
      },
      include: {
        category: true,
      },
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'محصولی با این نام یا نامک قبلاً وجود دارد' },
          { status: 400 }
        )
      }
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'دسته‌بندی انتخاب شده معتبر نیست' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'خطا در ایجاد محصول' },
      { status: 500 }
    )
  }
}
