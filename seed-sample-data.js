#!/usr/bin/env node

/**
 * اسکریپت ایجاد داده‌های نمونه (غیرفعال)
 * این اسکریپت حالا فقط کاربر ادمین را ایجاد یا به‌روزرسانی می‌کند
 *
 * استفاده:
 * node seed-sample-data.js
 */

const { createAdmin } = require('./create-admin');

async function seedSampleData() {
  console.log('ℹ️ ایجاد داده‌های نمونه غیرفعال شده است. تنها کاربر ادمین ایجاد/به‌روزرسانی می‌شود.\n');
  await createAdmin();
  console.log('✅ فرآیند تکمیل شد.');
}

if (require.main === module) {
  seedSampleData().catch((error) => {
    console.error('❌ خطا در ایجاد کاربر ادمین:', error?.message ?? error);
    process.exit(1);
  });
}

module.exports = { seedSampleData };
