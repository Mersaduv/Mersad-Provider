# پیاده‌سازی سیستم جستجوی Autocomplete

## خلاصه

سیستم جستجوی Autocomplete برای وب‌سایت شرکت بازرگانی مرصاد پیاده‌سازی شده است که شامل ویژگی‌های زیر می‌باشد:

## ویژگی‌های اصلی

### 1. جستجوی Real-time
- جستجوی لحظه‌ای در نام و توضیحات محصولات
- تاخیر 300 میلی‌ثانیه‌ای برای بهینه‌سازی عملکرد
- حداقل 2 کاراکتر برای شروع جستجو

### 2. رابط کاربری مینیمال و کاربرپسند
- طراحی تمیز و مدرن
- انیمیشن‌های نرم
- پشتیبانی کامل از RTL
- Responsive design برای موبایل و دسکتاپ

### 3. قابلیت‌های پیشرفته
- Navigation با کیبورد (Arrow keys, Enter, Escape)
- Highlight کردن کلمات جستجو شده
- نمایش تصویر محصول در نتایج
- نمایش دسته‌بندی محصول
- نمایش بخشی از توضیحات

### 4. تجربه کاربری بهینه
- Loading indicator
- پیام‌های مناسب برای حالت‌های مختلف
- بستن خودکار dropdown با کلیک خارج از آن
- Focus management

## فایل‌های پیاده‌سازی شده

### 1. API Endpoint
- `src/app/api/search/route.ts` - API برای جستجوی محصولات

### 2. کامپوننت اصلی
- `src/components/SearchAutocomplete.tsx` - کامپوننت جستجو

### 3. صفحات به‌روزرسانی شده
- `src/components/Navigation.tsx` - اضافه شدن جستجو به navigation
- `src/app/products/page.tsx` - پشتیبانی از جستجو در صفحه محصولات

## نحوه استفاده

### در Navigation
جستجو به صورت خودکار در navigation bar قرار گرفته است.

### در صفحه محصولات
کامپوننت جستجو در بالای صفحه محصولات نیز قرار دارد.

### API Usage
```javascript
// جستجوی محصولات
const response = await fetch('/api/search?q=کلمه_جستجو&limit=10');
const products = await response.json();
```

## ویژگی‌های فنی

### Performance
- Debounced search برای کاهش درخواست‌های API
- Pagination در نتایج (حداکثر 8 نتیجه)
- Lazy loading تصاویر

### Accessibility
- Keyboard navigation کامل
- ARIA labels مناسب
- Focus management
- Screen reader friendly

### Mobile Optimization
- Responsive design
- Touch-friendly interface
- Optimized layout برای صفحات کوچک

## تنظیمات قابل تغییر

### در SearchAutocomplete.tsx
- `DEBOUNCE_DELAY`: تاخیر جستجو (پیش‌فرض: 300ms)
- `MIN_SEARCH_LENGTH`: حداقل طول جستجو (پیش‌فرض: 2)
- `MAX_RESULTS`: حداکثر تعداد نتایج (پیش‌فرض: 8)

### در API
- `limit`: تعداد نتایج برگشتی
- `mode`: حالت جستجو (insensitive)

## نکات مهم

1. جستجو در نام و توضیحات محصولات انجام می‌شود
2. نتایج بر اساس نام محصول مرتب می‌شوند
3. فقط محصولات فعال در جستجو شرکت می‌کنند
4. جستجو case-insensitive است
5. از Prisma ORM برای جستجو استفاده می‌شود

## آینده‌نگری

امکان‌های توسعه آینده:
- جستجوی پیشرفته با فیلترها
- جستجو در دسته‌بندی‌ها
- پیشنهادات جستجو
- تاریخچه جستجو
- جستجوی fuzzy matching
