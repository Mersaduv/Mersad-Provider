#!/usr/bin/env node

/**
 * اسکریپت ایجاد کاربر ادمین
 * این اسکریپت یک کاربر ادمین جدید ایجاد می‌کند یا password موجود را به‌روزرسانی می‌کند
 * 
 * استفاده:
 * node create-admin.js
 * 
 * یا با پارامترهای سفارشی:
 * node create-admin.js --email admin@site.com --password mypassword --name "مدیر سایت"
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// تنظیمات پیش‌فرض
const DEFAULT_CONFIG = {
  email: 'admin@example.com',
  password: 'admin123',
  name: 'مدیر سیستم'
};

async function createAdmin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 شروع فرآیند ایجاد کاربر ادمین...\n');
    
    // دریافت پارامترهای خط فرمان
    const args = process.argv.slice(2);
    const config = parseArguments(args);
    
    console.log('📋 تنظیمات:');
    console.log(`   📧 ایمیل: ${config.email}`);
    console.log(`   👤 نام: ${config.name}`);
    console.log(`   🔑 رمز عبور: ${config.password}`);
    console.log('');
    
    // بررسی اتصال به دیتابیس
    console.log('🔌 بررسی اتصال به دیتابیس...');
    await prisma.$connect();
    console.log('✅ اتصال به دیتابیس برقرار شد\n');
    
    // Hash کردن password
    console.log('🔐 Hash کردن رمز عبور...');
    const hashedPassword = await bcrypt.hash(config.password, 10);
    console.log('✅ رمز عبور با موفقیت hash شد\n');
    
    // بررسی وجود کاربر
    console.log('🔍 بررسی وجود کاربر...');
    const existingUser = await prisma.user.findUnique({
      where: { email: config.email }
    });
    
    if (existingUser) {
      console.log('⚠️  کاربر با این ایمیل قبلاً وجود دارد');
      console.log('🔄 به‌روزرسانی اطلاعات کاربر...');
      
      const updatedUser = await prisma.user.update({
        where: { email: config.email },
        data: {
          name: config.name,
          password: hashedPassword,
          role: 'ADMIN',
          updatedAt: new Date()
        }
      });
      
      console.log('✅ اطلاعات کاربر با موفقیت به‌روزرسانی شد\n');
      displaySuccessInfo(updatedUser, config.password);
      
    } else {
      console.log('➕ ایجاد کاربر جدید...');
      
      const newUser = await prisma.user.create({
        data: {
          name: config.name,
          email: config.email,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('✅ کاربر ادمین با موفقیت ایجاد شد\n');
      displaySuccessInfo(newUser, config.password);
    }
    
    // نمایش آمار کلی
    await displayStats(prisma);
    
  } catch (error) {
    console.error('❌ خطا در ایجاد کاربر ادمین:');
    console.error(`   ${error.message}\n`);
    
    if (error.code === 'P2002') {
      console.log('💡 راه حل: ایمیل تکراری است. از ایمیل دیگری استفاده کنید.');
    } else if (error.code === 'P1001') {
      console.log('💡 راه حل: مشکل اتصال به دیتابیس. DATABASE_URL را بررسی کنید.');
    } else if (error.message.includes('bcrypt')) {
      console.log('💡 راه حل: bcryptjs نصب نشده است. npm install bcryptjs را اجرا کنید.');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

function parseArguments(args) {
  const config = { ...DEFAULT_CONFIG };
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    
    switch (key) {
      case '--email':
      case '-e':
        config.email = value;
        break;
      case '--password':
      case '-p':
        config.password = value;
        break;
      case '--name':
      case '-n':
        config.name = value;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
    }
  }
  
  return config;
}

function displaySuccessInfo(user, password) {
  console.log('🎉 کاربر ادمین آماده استفاده است!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📧 ایمیل:     ${user.email}`);
  console.log(`👤 نام:       ${user.name}`);
  console.log(`🔑 رمز عبور:  ${password}`);
  console.log(`🆔 شناسه:     ${user.id}`);
  console.log(`📅 ایجاد:     ${user.createdAt.toLocaleString('fa-IR')}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('🌐 برای ورود به پنل مدیریت:');
  console.log('   http://localhost:3000/admin/login\n');
}

async function displayStats(prisma) {
  try {
    const [userCount, productCount, categoryCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count()
    ]);
    
    console.log('📊 آمار کلی سیستم:');
    console.log(`   👥 کاربران: ${userCount}`);
    console.log(`   📦 محصولات: ${productCount}`);
    console.log(`   📁 دسته‌بندی‌ها: ${categoryCount}\n`);
    
  } catch (error) {
    console.log('⚠️  خطا در دریافت آمار: ' + error.message);
  }
}

function showHelp() {
  console.log(`
📖 راهنمای استفاده از اسکریپت ایجاد ادمین

استفاده:
  node create-admin.js [گزینه‌ها]

گزینه‌ها:
  -e, --email <email>      ایمیل ادمین (پیش‌فرض: admin@example.com)
  -p, --password <pass>    رمز عبور ادمین (پیش‌فرض: admin123)
  -n, --name <name>        نام ادمین (پیش‌فرض: مدیر سیستم)
  -h, --help               نمایش این راهنما

مثال‌ها:
  node create-admin.js
  node create-admin.js --email admin@mysite.com --password mypass123
  node create-admin.js -e admin@test.com -p secret123 -n "مدیر سایت"

نکات:
  - اگر کاربر با ایمیل مشابه وجود داشته باشد، اطلاعات به‌روزرسانی می‌شود
  - رمز عبور به صورت خودکار hash می‌شود
  - اطمینان حاصل کنید که دیتابیس در دسترس است
`);
}

// اجرای اسکریپت
if (require.main === module) {
  createAdmin();
}

module.exports = { createAdmin };
