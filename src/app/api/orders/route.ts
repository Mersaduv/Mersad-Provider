import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Order request body:", body);
    
    const { productId, productName, quantity, desiredPrice, customerName, customerPhone, notes, userId } = body;

    // Validate required fields
    if (!productId || !productName || !quantity || !desiredPrice || !customerName || !customerPhone) {
      console.error("Missing required fields:", {
        productId,
        productName,
        quantity,
        desiredPrice,
        customerName,
        customerPhone
      });
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

    // Find or create user by phone number
    let user;
    if (!userId) {
      // Try to find existing user by phone
      user = await prisma.user.findFirst({
        where: { phone: customerPhone }
      });

      // If user doesn't exist, create a new one
      if (!user) {
        try {
          const hashedPassword = await bcrypt.hash(customerPhone, 10);
          const emailPrefix = customerPhone.replace(/\D/g, ''); // Remove non-digits
          const timestamp = Date.now();
          const randomEmail = `customer_${emailPrefix}_${timestamp}@temp.com`;
          
          user = await prisma.user.create({
            data: {
              name: customerName,
              email: randomEmail,
              password: hashedPassword,
              phone: customerPhone,
              role: 'USER'
            }
          });
        } catch (createError: any) {
          // If creation fails due to email conflict, try to find again
          if (createError.code === 'P2002') {
            user = await prisma.user.findFirst({
              where: { phone: customerPhone }
            });
          } else {
            throw createError;
          }
        }
      }
    } else {
      // If userId is provided, fetch that user
      user = await prisma.user.findUnique({
        where: { id: userId }
      });
    }

    // Create the order
    const orderData = {
      productId,
      productName,
      quantity: parseInt(quantity),
      desiredPrice: parseFloat(desiredPrice),
      customerName: customerName || "مشتری",
      customerPhone,
      notes: notes || null,
      userId: user?.id || userId || null,
    };

    console.log("Creating order with data:", orderData);

    const order = await prisma.order.create({
      data: orderData,
    });

    console.log("Order created successfully:", order.id);

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
        },
        userId: user?.id || userId,
        userPhone: customerPhone,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    });
    
    // Return more detailed error for debugging
    const errorMessage = error?.meta?.target 
      ? `خطا در ثبت سفارش: ${error.message}` 
      : "خطا در ثبت سفارش";
    
    return NextResponse.json(
      { error: errorMessage },
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
