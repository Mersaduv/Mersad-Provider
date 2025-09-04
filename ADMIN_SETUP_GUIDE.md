# راهنمای راه‌اندازی ادمین و مدیریت سیستم

## 📋 فهرست مطالب
- [نصب و راه‌اندازی اولیه](#نصب-و-راه‌اندازی-اولیه)
- [ایجاد کاربر ادمین](#ایجاد-کاربر-ادمین)
- [مدیریت محصولات](#مدیریت-محصولات)
- [مدیریت دسته‌بندی‌ها](#مدیریت-دسته‌بندی‌ها)
- [مدیریت اسلایدرها](#مدیریت-اسلایدرها)
- [مدیریت مقالات](#مدیریت-مقالات)
- [API Endpoints](#api-endpoints)
- [مشکلات رایج](#مشکلات-رایج)

## 🚀 نصب و راه‌اندازی اولیه

### 1. نصب وابستگی‌ها
```bash
npm install
```

### 2. تنظیم متغیرهای محیطی
فایل `.env.local` را ایجاد کنید:
```env
DATABASE_URL="your_database_connection_string"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. راه‌اندازی دیتابیس
```bash
# ایجاد migration ها
npx prisma migrate dev

# تولید Prisma Client
npx prisma generate

# همگام‌سازی schema با دیتابیس
npx prisma db push
```

### 4. راه‌اندازی سرور
```bash
npm run dev
```

## 👤 ایجاد کاربر ادمین

### روش 1: استفاده از اسکریپت خودکار
فایل `create-admin.js` را ایجاد کنید:

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Creating admin user...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
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
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Name: مدیر سیستم');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
```

اجرای اسکریپت:
```bash
node create-admin.js
```

### روش 2: استفاده از API
```bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "مدیر سیستم",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### روش 3: دستی از طریق دیتابیس
```sql
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'مدیر سیستم',
  'admin@example.com',
  '$2a$10$hashed_password_here',
  'ADMIN',
  NOW(),
  NOW()
);
```

## 📦 مدیریت محصولات

### دسترسی به پنل مدیریت
1. به آدرس `http://localhost:3000/admin/login` بروید
2. با اطلاعات ادمین وارد شوید:
   - **ایمیل:** `admin@example.com`
   - **رمز عبور:** `admin123`

### ویژگی‌های مدیریت محصولات
- ✅ ایجاد محصول جدید
- ✅ ویرایش محصولات موجود
- ✅ حذف محصولات
- ✅ تنظیم محصولات به عنوان "پرفروش"
- ✅ آپلود تصاویر محصول
- ✅ انتخاب دسته‌بندی

### فیلدهای محصول
- **نام محصول:** نام فارسی محصول
- **نامک (Slug):** آدرس URL محصول
- **توضیحات:** توضیحات کامل محصول (HTML)
- **دسته‌بندی:** انتخاب از دسته‌بندی‌های موجود
- **تصاویر:** آپلود چندین تصویر
- **پرفروش:** تیک برای نمایش در اسلایدر پرفروش‌ترین

## 📁 مدیریت دسته‌بندی‌ها

### ایجاد دسته‌بندی جدید
1. به بخش "دسته‌بندی‌ها" بروید
2. روی "دسته‌بندی جدید" کلیک کنید
3. اطلاعات را پر کنید:
   - **نام:** نام دسته‌بندی
   - **توضیحات:** توضیحات دسته‌بندی
   - **نامک:** آدرس URL
   - **سطح:** 0 برای دسته اصلی، 1+ برای زیردسته
   - **دسته والد:** برای زیردسته‌ها
   - **تصویر:** آپلود تصویر دسته‌بندی

### ساختار سلسله‌مراتبی
```
الکترونیک (سطح 0)
├── گوشی‌های هوشمند (سطح 1)
│   ├── آیفون (سطح 2)
│   └── اندروید (سطح 2)
└── لپ‌تاپ‌ها (سطح 1)
    ├── مک‌بوک (سطح 2)
    └── ویندوز (سطح 2)
```

## 🎠 مدیریت اسلایدرها

### ایجاد اسلایدر جدید
1. به بخش "اسلایدرها" بروید
2. روی "اسلایدر جدید" کلیک کنید
3. اطلاعات را پر کنید:
   - **عنوان:** عنوان اسلایدر
   - **لینک:** آدرس مقصد (اختیاری)
   - **تصویر:** آپلود تصویر اسلایدر
   - **ترتیب:** ترتیب نمایش
   - **فعال:** وضعیت نمایش

### تنظیمات اسلایدر
- **Auto-play:** 5 ثانیه
- **Navigation:** دکمه‌های قبلی/بعدی
- **Pagination:** نقاط پایین اسلایدر
- **Responsive:** سازگار با موبایل

## 📰 مدیریت مقالات

### ایجاد مقاله جدید
1. به بخش "مقالات" بروید
2. روی "مقاله جدید" کلیک کنید
3. اطلاعات را پر کنید:
   - **عنوان:** عنوان مقاله
   - **توضیحات:** محتوای مقاله (HTML)
   - **نامک:** آدرس URL
   - **ترتیب:** ترتیب نمایش
   - **فعال:** وضعیت انتشار

## 🔌 API Endpoints

### محصولات
```bash
# دریافت همه محصولات
GET /api/products

# دریافت محصولات پرفروش
GET /api/products/best-selling

# دریافت جدیدترین محصولات
GET /api/products/newest

# دریافت محصول خاص
GET /api/products/[id]

# ایجاد محصول جدید
POST /api/products

# ویرایش محصول
PUT /api/products/[id]

# حذف محصول
DELETE /api/products/[id]
```

### دسته‌بندی‌ها
```bash
# دریافت همه دسته‌بندی‌ها
GET /api/categories

# ایجاد دسته‌بندی جدید
POST /api/categories

# ویرایش دسته‌بندی
PUT /api/categories/[id]

# حذف دسته‌بندی
DELETE /api/categories/[id]
```

### اسلایدرها
```bash
# دریافت اسلایدرها
GET /api/sliders

# ایجاد اسلایدر جدید
POST /api/sliders

# ویرایش اسلایدر
PUT /api/sliders/[id]

# حذف اسلایدر
DELETE /api/sliders/[id]
```

### مقالات
```bash
# دریافت مقالات
GET /api/articles

# ایجاد مقاله جدید
POST /api/articles

# ویرایش مقاله
PUT /api/articles/[id]

# حذف مقاله
DELETE /api/articles/[id]
```

## 🐛 مشکلات رایج

### 1. خطای "اطلاعات ورود نامعتبر است"
**علت:** Password در دیتابیس hash نشده است
**راه حل:**
```bash
# اجرای اسکریپت fix-password
node fix-password.js
```

### 2. خطای "The column Product.bestSelling does not exist"
**علت:** Migration اجرا نشده است
**راه حل:**
```bash
npx prisma db push
npx prisma generate
```

### 3. خطای "Can't reach database server"
**علت:** مشکل اتصال به دیتابیس
**راه حل:**
- بررسی DATABASE_URL در .env
- اطمینان از فعال بودن دیتابیس
- بررسی فایروال و شبکه

### 4. تصاویر نمایش داده نمی‌شوند
**علت:** فایل‌های تصویر در پوشه public وجود ندارند
**راه حل:**
- تصاویر را در پوشه `public/uploads/` قرار دهید
- از پنل مدیریت آپلود کنید

### 5. اسلایدرهای محصول خالی هستند
**علت:** محصولی در دیتابیس وجود ندارد
**راه حل:**
- محصولات نمونه ایجاد کنید
- محصولات را به عنوان "پرفروش" علامت‌گذاری کنید

## 📊 ساختار دیتابیس

### جدول User
```sql
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role "Role" DEFAULT 'USER',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL
);
```

### جدول Product
```sql
CREATE TABLE "Product" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  categoryId TEXT NOT NULL,
  bestSelling BOOLEAN DEFAULT false,
  imageUrls TEXT[],
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL
);
```

### جدول Category
```sql
CREATE TABLE "Category" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  level INTEGER DEFAULT 0,
  order INTEGER DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  parentId TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL
);
```

## 🎯 نکات مهم

1. **امنیت:** همیشه password ها را hash کنید
2. **Backup:** به طور منظم از دیتابیس backup بگیرید
3. **Images:** تصاویر را بهینه کنید (WebP, compression)
4. **SEO:** از slug های مناسب استفاده کنید
5. **Performance:** از pagination برای لیست‌های طولانی استفاده کنید

## 📞 پشتیبانی

در صورت بروز مشکل:
1. لاگ‌های سرور را بررسی کنید
2. دیتابیس را چک کنید
3. متغیرهای محیطی را بررسی کنید
4. از مستندات Prisma استفاده کنید

---

**تاریخ آخرین به‌روزرسانی:** 2024
**نسخه:** 1.0.0
