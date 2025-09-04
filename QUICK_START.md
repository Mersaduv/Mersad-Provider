# 🚀 راه‌اندازی سریع سیستم

## ⚡ نصب و راه‌اندازی در 3 مرحله

### 1️⃣ نصب وابستگی‌ها
```bash
npm install
```

### 2️⃣ راه‌اندازی دیتابیس
```bash
npm run db:push
npm run db:generate
```

### 3️⃣ ایجاد ادمین و داده‌های نمونه
```bash
npm run setup
```

## 🎉 تمام! سیستم آماده است

### دسترسی‌ها:
- **🌐 سایت:** http://localhost:3000
- **🔧 پنل مدیریت:** http://localhost:3000/admin/login
- **📧 ایمیل ادمین:** admin@example.com
- **🔑 رمز عبور:** admin123

## 📋 دستورات مفید

### مدیریت ادمین
```bash
# ایجاد ادمین جدید
npm run create-admin

# ایجاد ادمین با اطلاعات سفارشی
node create-admin.js --email admin@mysite.com --password mypass123 --name "مدیر سایت"
```

### مدیریت داده‌ها
```bash
# ایجاد داده‌های نمونه
npm run seed-sample

# ریست کامل دیتابیس
npm run db:reset
```

### توسعه
```bash
# اجرای سرور توسعه
npm run dev

# ساخت پروژه
npm run build

# اجرای پروژه
npm run start
```

## 🆘 در صورت مشکل

### خطای اتصال به دیتابیس
```bash
# بررسی DATABASE_URL در .env.local
# اطمینان از فعال بودن دیتابیس
```

### خطای authentication
```bash
# اجرای مجدد ایجاد ادمین
npm run create-admin
```

### خطای migration
```bash
# ریست دیتابیس
npm run db:reset
npm run setup
```

## 📚 مستندات کامل
برای اطلاعات بیشتر، فایل `ADMIN_SETUP_GUIDE.md` را مطالعه کنید.

---
**زمان راه‌اندازی:** کمتر از 5 دقیقه ⏱️
