#!/usr/bin/env node

/**
 * اسکریپت ایجاد داده‌های نمونه
 * این اسکریپت دسته‌بندی‌ها، محصولات، اسلایدرها و مقالات نمونه ایجاد می‌کند
 * 
 * استفاده:
 * node seed-sample-data.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function seedSampleData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🌱 شروع فرآیند ایجاد داده‌های نمونه...\n');
    
    // بررسی اتصال به دیتابیس
    console.log('🔌 بررسی اتصال به دیتابیس...');
    await prisma.$connect();
    console.log('✅ اتصال به دیتابیس برقرار شد\n');
    
    // 1. ایجاد کاربر ادمین
    console.log('👤 ایجاد کاربر ادمین...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'مدیر سیستم',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('✅ کاربر ادمین ایجاد شد\n');
    
    // 2. ایجاد دسته‌بندی‌ها
    console.log('📁 ایجاد دسته‌بندی‌ها...');
    
    const mainCategory = await prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'الکترونیک',
        description: 'دسته‌بندی محصولات الکترونیکی و دیجیتال',
        slug: 'electronics',
        level: 0,
        order: 1,
        isActive: true
      }
    });
    
    const smartphoneCategory = await prisma.category.upsert({
      where: { slug: 'smartphones' },
      update: {},
      create: {
        name: 'گوشی‌های هوشمند',
        description: 'گوشی‌های هوشمند و تلفن‌های همراه',
        slug: 'smartphones',
        level: 1,
        order: 1,
        isActive: true,
        parentId: mainCategory.id
      }
    });
    
    const laptopCategory = await prisma.category.upsert({
      where: { slug: 'laptops' },
      update: {},
      create: {
        name: 'لپ‌تاپ‌ها',
        description: 'لپ‌تاپ‌ها و کامپیوترهای قابل حمل',
        slug: 'laptops',
        level: 1,
        order: 2,
        isActive: true,
        parentId: mainCategory.id
      }
    });
    
    const homeCategory = await prisma.category.upsert({
      where: { slug: 'home-appliances' },
      update: {},
      create: {
        name: 'لوازم خانگی',
        description: 'لوازم خانگی و تجهیزات منزل',
        slug: 'home-appliances',
        level: 0,
        order: 2,
        isActive: true
      }
    });
    
    console.log('✅ دسته‌بندی‌ها ایجاد شدند\n');
    
    // 3. ایجاد محصولات
    console.log('📱 ایجاد محصولات...');
    
    const products = [
      {
        name: 'گوشی هوشمند سامسونگ گلکسی S24',
        slug: 'samsung-galaxy-s24',
        description: '<p>گوشی هوشمند سامسونگ گلکسی S24 با پردازنده قدرتمند Snapdragon 8 Gen 3، دوربین 200 مگاپیکسلی و صفحه نمایش 6.2 اینچی Dynamic AMOLED 2X</p>',
        categoryId: smartphoneCategory.id,
        bestSelling: true,
        imageUrls: ""
      },
      {
        name: 'آیفون 15 پرو',
        slug: 'iphone-15-pro',
        description: '<p>آیفون 15 پرو با تراشه A17 Pro، دوربین 48 مگاپیکسلی، صفحه نمایش 6.1 اینچی Super Retina XDR و طراحی تیتانیومی</p>',
        categoryId: smartphoneCategory.id,
        bestSelling: true,
        imageUrls: ""
      },
      {
        name: 'گوشی هوشمند شیائومی 14',
        slug: 'xiaomi-14',
        description: '<p>گوشی هوشمند شیائومی 14 با تراشه Snapdragon 8 Gen 3، دوربین 50 مگاپیکسلی Leica و صفحه نمایش 6.36 اینچی LTPO OLED</p>',
        categoryId: smartphoneCategory.id,
        bestSelling: false,
        imageUrls: ""
      },
      {
        name: 'لپ‌تاپ مک‌بوک پرو M3',
        slug: 'macbook-pro-m3',
        description: '<p>لپ‌تاپ مک‌بوک پرو با تراشه M3، صفحه نمایش 14 اینچی Liquid Retina XDR، حافظه 8GB و ذخیره‌سازی 512GB SSD</p>',
        categoryId: laptopCategory.id,
        bestSelling: true,
        imageUrls: ""
      },
      {
        name: 'لپ‌تاپ دل XPS 13',
        slug: 'dell-xps-13',
        description: '<p>لپ‌تاپ دل XPS 13 با پردازنده Intel Core i7، صفحه نمایش 13.4 اینچی 4K، حافظه 16GB و ذخیره‌سازی 512GB SSD</p>',
        categoryId: laptopCategory.id,
        bestSelling: false,
        imageUrls: ""
      },
      {
        name: 'لپ‌تاپ لنوو ThinkPad X1',
        slug: 'lenovo-thinkpad-x1',
        description: '<p>لپ‌تاپ لنوو ThinkPad X1 Carbon با پردازنده Intel Core i7، صفحه نمایش 14 اینچی WUXGA، حافظه 16GB و ذخیره‌سازی 1TB SSD</p>',
        categoryId: laptopCategory.id,
        bestSelling: false,
        imageUrls: ""
      },
      {
        name: 'جاروبرقی هوشمند دایسون V15',
        slug: 'dyson-v15-vacuum',
        description: '<p>جاروبرقی بی‌سیم دایسون V15 با موتور دیجیتال V15، باتری 60 دقیقه‌ای و فیلتر HEPA کامل</p>',
        categoryId: homeCategory.id,
        bestSelling: true,
        imageUrls: ""
      },
      {
        name: 'مایکروویو سامسونگ 32 لیتری',
        slug: 'samsung-microwave-32l',
        description: '<p>مایکروویو سامسونگ با ظرفیت 32 لیتر، قدرت 1000 وات، 10 سطح قدرت و تایمر دیجیتال</p>',
        categoryId: homeCategory.id,
        bestSelling: false,
        imageUrls: ""
      }
    ];
    
    for (const productData of products) {
      await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: productData
      });
    }
    
    console.log('✅ محصولات ایجاد شدند\n');
    
    // 4. ایجاد اسلایدرها
    console.log('🎠 ایجاد اسلایدرها...');
    
    const sliders = [
      {
        title: 'فروش ویژه محصولات الکترونیکی',
        link: '/products?category=electronics',
        imageUrl: '/uploads/sliders/electronics-sale.jpg',
        order: 1,
        isActive: true
      },
      {
        title: 'جدیدترین گوشی‌های هوشمند',
        link: '/products?category=smartphones',
        imageUrl: '/uploads/sliders/smartphones.jpg',
        order: 2,
        isActive: true
      },
      {
        title: 'لپ‌تاپ‌های حرفه‌ای',
        link: '/products?category=laptops',
        imageUrl: '/uploads/sliders/laptops.jpg',
        order: 3,
        isActive: true
      },
      {
        title: 'لوازم خانگی مدرن',
        link: '/products?category=home-appliances',
        imageUrl: '/uploads/sliders/home-appliances.jpg',
        order: 4,
        isActive: true
      }
    ];
    
    for (const sliderData of sliders) {
      await prisma.slider.upsert({
        where: { id: sliderData.title },
        update: {},
        create: sliderData
      });
    }
    
    console.log('✅ اسلایدرها ایجاد شدند\n');
    
    // 5. ایجاد مقالات
    console.log('📰 ایجاد مقالات...');
    
    const articles = [
      {
        title: 'راهنمای خرید گوشی هوشمند در سال 2024',
        description: '<p>راهنمای کامل برای انتخاب بهترین گوشی هوشمند بر اساس نیاز، بودجه و ویژگی‌های مورد نظر شما. مقایسه برندهای مختلف و نکات مهم خرید.</p>',
        slug: 'smartphone-buying-guide-2024',
        isActive: true,
        order: 1
      },
      {
        title: 'مقایسه لپ‌تاپ‌های برتر 2024',
        description: '<p>مقایسه کامل لپ‌تاپ‌های برتر سال 2024 شامل مک‌بوک، دل، لنوو و سایر برندهای معروف. بررسی ویژگی‌ها، قیمت و کاربردهای مختلف.</p>',
        slug: 'laptop-comparison-2024',
        isActive: true,
        order: 2
      },
      {
        title: 'نکات نگهداری لوازم خانگی',
        description: '<p>راهنمای نگهداری و مراقبت از لوازم خانگی برای افزایش طول عمر و عملکرد بهتر. نکات مهم برای جاروبرقی، مایکروویو و سایر دستگاه‌ها.</p>',
        slug: 'home-appliances-maintenance',
        isActive: true,
        order: 3
      },
      {
        title: 'تکنولوژی‌های نوین در الکترونیک',
        description: '<p>آخرین تکنولوژی‌ها و نوآوری‌ها در دنیای الکترونیک و دیجیتال. بررسی روندهای آینده و تأثیر آن‌ها بر زندگی روزمره.</p>',
        slug: 'latest-electronics-technology',
        isActive: true,
        order: 4
      }
    ];
    
    for (const articleData of articles) {
      await prisma.article.upsert({
        where: { slug: articleData.slug },
        update: {},
        create: articleData
      });
    }
    
    console.log('✅ مقالات ایجاد شدند\n');
    
    // نمایش آمار نهایی
    await displayFinalStats(prisma);
    
    console.log('🎉 داده‌های نمونه با موفقیت ایجاد شدند!');
    console.log('\n🌐 برای مشاهده سایت:');
    console.log('   http://localhost:3000');
    console.log('\n🔧 برای ورود به پنل مدیریت:');
    console.log('   http://localhost:3000/admin/login');
    console.log('   📧 ایمیل: admin@example.com');
    console.log('   🔑 رمز عبور: admin123\n');
    
  } catch (error) {
    console.error('❌ خطا در ایجاد داده‌های نمونه:');
    console.error(`   ${error.message}\n`);
    
    if (error.code === 'P1001') {
      console.log('💡 راه حل: مشکل اتصال به دیتابیس. DATABASE_URL را بررسی کنید.');
    } else if (error.message.includes('bcrypt')) {
      console.log('💡 راه حل: bcryptjs نصب نشده است. npm install bcryptjs را اجرا کنید.');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function displayFinalStats(prisma) {
  try {
    const [userCount, productCount, categoryCount, sliderCount, articleCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
      prisma.slider.count(),
      prisma.article.count()
    ]);
    
    const bestSellingCount = await prisma.product.count({
      where: { bestSelling: true }
    });
    
    console.log('📊 آمار نهایی سیستم:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👥 کاربران:           ${userCount}`);
    console.log(`📦 محصولات:           ${productCount}`);
    console.log(`   ⭐ پرفروش:         ${bestSellingCount}`);
    console.log(`📁 دسته‌بندی‌ها:        ${categoryCount}`);
    console.log(`🎠 اسلایدرها:         ${sliderCount}`);
    console.log(`📰 مقالات:            ${articleCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.log('⚠️  خطا در دریافت آمار: ' + error.message);
  }
}

// اجرای اسکریپت
if (require.main === module) {
  seedSampleData();
}

module.exports = { seedSampleData };
