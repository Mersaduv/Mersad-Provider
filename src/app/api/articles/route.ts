import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/articles - Get all articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    
    const whereClause = isActive !== null ? { isActive: isActive === 'true' } : {}
    
    const articles = await prisma.article.findMany({
      where: whereClause,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })
    
    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت مقالات' },
      { status: 500 }
    )
  }
}

// POST /api/articles - Create a new article
export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    
    // Validate required fields
    if (!json.title || !json.description || !json.slug) {
      return NextResponse.json(
        { error: 'تمام فیلدهای اجباری باید پر شوند' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug: json.slug }
    })
    
    if (existingArticle) {
      return NextResponse.json(
        { error: 'نامک (slug) تکراری است' },
        { status: 400 }
      )
    }
    
    const article = await prisma.article.create({
      data: {
        title: json.title,
        description: json.description,
        slug: json.slug,
        isActive: json.isActive !== undefined ? json.isActive : true,
        order: json.order || 0,
      }
    })
    
    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    
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
      { error: 'خطا در ایجاد مقاله' },
      { status: 500 }
    )
  }
}
