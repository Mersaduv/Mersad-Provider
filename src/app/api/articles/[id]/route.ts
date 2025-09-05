import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/articles/[id] - Get a specific article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id }
    })
    
    if (!article) {
      return NextResponse.json(
        { error: 'مقاله یافت نشد' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت مقاله' },
      { status: 500 }
    )
  }
}

// PUT /api/articles/[id] - Update an article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await request.json()
    
    // Validate required fields
    if (!json.title || !json.description || !json.slug) {
      return NextResponse.json(
        { error: 'تمام فیلدهای اجباری باید پر شوند' },
        { status: 400 }
      )
    }

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    })
    
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'مقاله یافت نشد' },
        { status: 404 }
      )
    }

    // Check if slug already exists for another article
    const slugConflict = await prisma.article.findFirst({
      where: { 
        slug: json.slug,
        id: { not: id }
      }
    })
    
    if (slugConflict) {
      return NextResponse.json(
        { error: 'نامک (slug) تکراری است' },
        { status: 400 }
      )
    }
    
    const article = await prisma.article.update({
      where: { id },
      data: {
        title: json.title,
        description: json.description,
        slug: json.slug,
        isActive: json.isActive !== undefined ? json.isActive : true,
        order: json.order || 0,
      }
    })
    
    return NextResponse.json(article)
  } catch (error) {
    console.error('Error updating article:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'مقاله‌ای با این نام یا نامک قبلاً وجود دارد' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'خطا در به‌روزرسانی مقاله' },
      { status: 500 }
    )
  }
}

// DELETE /api/articles/[id] - Delete an article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    })
    
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'مقاله یافت نشد' },
        { status: 404 }
      )
    }
    
    await prisma.article.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'مقاله با موفقیت حذف شد' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'خطا در حذف مقاله' },
      { status: 500 }
    )
  }
}
