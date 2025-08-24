import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // پاک کردن داده‌های موجود
  await prisma.product.deleteMany()
  await prisma.feature.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  
  console.log('داده‌های قبلی پاک شد')
  
  // ایجاد کاربران نمونه
  const admin = await prisma.user.create({
    data: {
      name: 'مدیر سیستم',
      role: 'ADMIN',
    }
  })
  
  const user = await prisma.user.create({
    data: {
      name: 'کاربر معمولی',
      role: 'USER',
    }
  })
  
  console.log('کاربران ایجاد شدند:', { admin, user })
  
  // ایجاد دسته‌بندی‌های نمونه
  const digitalCategory = await prisma.category.create({
    data: {
      name: 'کالای دیجیتال',
      description: 'لوازم الکترونیکی و دیجیتال',
    }
  })
  
  const clothingCategory = await prisma.category.create({
    data: {
      name: 'پوشاک',
      description: 'انواع لباس و پوشاک',
    }
  })
  
  console.log('دسته‌بندی‌ها ایجاد شدند:', { digitalCategory, clothingCategory })
  
  // ایجاد ویژگی‌های نمونه
  const colorFeature = await prisma.feature.create({
    data: {
      name: 'رنگ',
      value: 'مشکی',
    }
  })
  
  const sizeFeature = await prisma.feature.create({
    data: {
      name: 'سایز',
      value: 'متوسط',
    }
  })
  
  console.log('ویژگی‌ها ایجاد شدند:', { colorFeature, sizeFeature })
  
  // ایجاد محصولات نمونه
  const smartphone = await prisma.product.create({
    data: {
      name: 'گوشی هوشمند شیائومی',
      slug: 'xiaomi-smartphone',
      description: 'گوشی هوشمند شیائومی با صفحه نمایش 6.5 اینچی و دوربین 64 مگاپیکسلی',
      imageUrls: [
        'https://example.com/images/smartphone1.jpg',
        'https://example.com/images/smartphone2.jpg',
      ],
      rating: 4.5,
      comment: 'محصول پرطرفدار با کیفیت عالی',
      categoryId: digitalCategory.id,
    }
  })
  
  const laptop = await prisma.product.create({
    data: {
      name: 'لپ تاپ ایسوس',
      slug: 'asus-laptop',
      description: 'لپ تاپ ایسوس با پردازنده Core i7 و کارت گرافیک قدرتمند',
      imageUrls: [
        'https://example.com/images/laptop1.jpg',
        'https://example.com/images/laptop2.jpg',
      ],
      rating: 4.8,
      comment: 'مناسب برای بازی و کارهای حرفه‌ای',
      categoryId: digitalCategory.id,
    }
  })
  
  const tShirt = await prisma.product.create({
    data: {
      name: 'تیشرت مردانه',
      slug: 'mens-tshirt',
      description: 'تیشرت مردانه نخی با طرح ساده',
      imageUrls: [
        'https://example.com/images/tshirt1.jpg',
        'https://example.com/images/tshirt2.jpg',
      ],
      rating: 4.2,
      comment: 'جنس نخ پنبه درجه یک',
      categoryId: clothingCategory.id,
    }
  })
  
  console.log('محصولات ایجاد شدند:', { smartphone, laptop, tShirt })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
