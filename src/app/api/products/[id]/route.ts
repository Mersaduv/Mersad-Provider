import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/products/[id] - Get a product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'محصول یافت نشد' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت محصول' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update a product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json()
    
    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name: json.name,
        slug: json.slug,
        description: json.description,
        imageUrls: json.imageUrls || [],
        categoryId: json.categoryId,
        bestSelling: json.bestSelling !== undefined ? json.bestSelling : false,
      },
      include: {
        category: true,
      },
    })
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی محصول' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete a product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.product.delete({
      where: {
        id,
      },
    })
    
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'خطا در حذف محصول' },
      { status: 500 }
    )
  }
}
