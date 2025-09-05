# راهنمای استفاده از ParentCategoryProductSlider

## معرفی
`ParentCategoryProductSlider` یک کامپوننت React است که محصولات مرتبط را به صورت اسلایدر نمایش می‌دهد. این کامپوننت محصولات را از سه منبع جمع‌آوری می‌کند:
1. **دسته‌بندی فعلی** - محصولات از همان دسته‌بندی
2. **دسته‌بندی پدر** - محصولات از دسته‌بندی والد (اگر وجود داشته باشد)
3. **دسته‌بندی‌های فرزند** - محصولات از تمام دسته‌بندی‌های فرزند

## ویژگی‌ها
- نمایش محصولات از دسته‌بندی فعلی، پدر و فرزندان
- اسلایدر افقی با قابلیت اسکرول
- دکمه‌های ناوبری برای حرکت در اسلایدر
- طراحی ریسپانسیو
- نمایش اطلاعات محصول شامل تصویر، نام، دسته‌بندی و توضیحات
- لینک مستقیم به صفحه محصول

## نحوه استفاده

### 1. استفاده مستقیم
```tsx
import ParentCategoryProductSlider from "@/components/ParentCategoryProductSlider";

function MyComponent() {
  return (
    <ParentCategoryProductSlider
      categoryId="category-id"
      categoryName="نام دسته‌بندی"
      title="عنوان اسلایدر"
      description="توضیحات اسلایدر"
      icon={<YourIcon />}
      limit={10}
    />
  );
}
```

### 2. استفاده با کامپوننت Demo
```tsx
import ParentCategorySliderDemo from "@/components/ParentCategorySliderDemo";

function MyComponent() {
  return (
    <ParentCategorySliderDemo
      categoryId="category-id"
      categoryName="نام دسته‌بندی"
    />
  );
}
```

## Props

| Prop | نوع | اجباری | توضیحات |
|------|-----|--------|---------|
| `categoryId` | string | ✅ | شناسه دسته‌بندی فعلی |
| `categoryName` | string | ✅ | نام دسته‌بندی فعلی |
| `title` | string | ❌ | عنوان اسلایدر (پیش‌فرض: "محصولات مرتبط با {categoryName}") |
| `description` | string | ❌ | توضیحات اسلایدر |
| `icon` | React.ReactNode | ❌ | آیکون نمایش داده شده در کنار عنوان |
| `limit` | number | ❌ | حداکثر تعداد محصولات نمایش داده شده (پیش‌فرض: 10) |

## API Endpoint
کامپوننت از API endpoint زیر استفاده می‌کند:
```
GET /api/products/related-categories?categoryId={id}&limit={number}
```

## مثال کامل
```tsx
import ParentCategoryProductSlider from "@/components/ParentCategoryProductSlider";

export default function ProductPage() {
  return (
    <div>
      {/* سایر محتویات صفحه */}
      
      <ParentCategoryProductSlider
        categoryId="electronics-category-id"
        categoryName="الکترونیک"
        title="محصولات مرتبط با الکترونیک"
        description="بهترین محصولات الکترونیک و محصولات مرتبط را از ما بخرید"
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        }
        limit={8}
      />
    </div>
  );
}
```

## نکات مهم
1. کامپوننت به صورت خودکار محصولات را از دسته‌بندی فعلی، پدر و فرزندان جمع‌آوری می‌کند
2. در صورت عدم وجود دسته‌بندی پدر یا فرزند، فقط محصولات دسته‌بندی فعلی نمایش داده می‌شود
3. کامپوننت به صورت خودکار محصولات را از API دریافت می‌کند
4. در صورت عدم وجود محصول، پیام مناسب نمایش داده می‌شود
5. کامپوننت کاملاً ریسپانسیو است و در تمام اندازه‌های صفحه کار می‌کند
