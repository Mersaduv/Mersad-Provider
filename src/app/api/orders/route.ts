import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productName, quantity, desiredPrice, customerName, customerPhone, notes, userId } = body;

    // Validate required fields
    if (!productId || !productName || !quantity || !desiredPrice || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: "تمام فیلدهای الزامی را پر کنید" },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity <= 0) {
      return NextResponse.json(
        { error: "تعداد باید بیشتر از صفر باشد" },
        { status: 400 }
      );
    }

    // Validate price
    if (desiredPrice <= 0) {
      return NextResponse.json(
        { error: "قیمت باید بیشتر از صفر باشد" },
        { status: 400 }
      );
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        productId,
        productName,
        quantity,
        desiredPrice,
        customerName,
        customerPhone,
        notes: notes || null,
        userId: userId || null,
      },
    });

    return NextResponse.json(
      { 
        message: "سفارش با موفقیت ثبت شد", 
        order: {
          id: order.id,
          productName: order.productName,
          quantity: order.quantity,
          desiredPrice: order.desiredPrice,
          status: order.status,
          createdAt: order.createdAt,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "خطا در ثبت سفارش" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status;
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سفارشات" },
      { status: 500 }
    );
  }
}
