#!/usr/bin/env node

/**
 * اسکریپت تست اتصال به دیتابیس در Vercel
 * این اسکریپت برای تست اتصال در محیط production استفاده می‌شود
 * 
 * استفاده:
 * node test-vercel-database.js
 */

const { PrismaClient } = require('@prisma/client');

async function testVercelDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔌 در حال تست اتصال به دیتابیس Vercel...');
    console.log('🌐 Environment:', process.env.NODE_ENV);
    console.log('🔗 Database URL:', process.env.DATABASE_URL ? '✅ تنظیم شده' : '❌ تنظیم نشده');
    
    // تست اتصال
    await prisma.$connect();
    console.log('✅ اتصال به دیتابیس Vercel برقرار شد');
    
    // تست جدول‌ها
    const tables = {
      users: await prisma.user.count(),
      categories: await prisma.category.count(),
      products: await prisma.product.count(),
      orders: await prisma.order.count(),
      articles: await prisma.article.count(),
      sliders: await prisma.slider.count()
    };
    
    console.log('\n📊 آمار دیتابیس:');
    Object.entries(tables).forEach(([table, count]) => {
      console.log(`   ${table}: ${count}`);
    });
    
    // تست ایجاد یک سفارش نمونه
    console.log('\n🧪 تست ایجاد سفارش...');
    const testOrder = await prisma.order.create({
      data: {
        productId: 'test-product-id',
        productName: 'محصول تست',
        quantity: 1,
        desiredPrice: 100000,
        customerName: 'مشتری تست',
        customerPhone: '09123456789',
        status: 'PENDING'
      }
    });
    
    console.log('✅ سفارش تست با موفقیت ایجاد شد:', testOrder.id);
    
    // حذف سفارش تست
    await prisma.order.delete({
      where: { id: testOrder.id }
    });
    console.log('🗑️ سفارش تست حذف شد');
    
    console.log('\n🎉 دیتابیس Vercel کاملاً آماده است!');
    
  } catch (error) {
    console.error('❌ خطا در اتصال به دیتابیس Vercel:');
    console.error('📋 جزئیات خطا:', error.message);
    console.error('🔍 کد خطا:', error.code);
    
    if (error.code === 'P2021') {
      console.error('💡 راه‌حل: جدول‌ها وجود ندارند. migration ها را اجرا کنید');
    } else if (error.code === 'P1001') {
      console.error('💡 راه‌حل: دیتابیس در دسترس نیست. DATABASE_URL را بررسی کنید');
    } else if (error.code === 'P1017') {
      console.error('💡 راه‌حل: اتصال قطع شده. دیتابیس را بررسی کنید');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای تست
testVercelDatabase();
