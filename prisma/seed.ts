import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create root categories (level 0)
  const electronicsCategory = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      level: 0,
      order: 1,
      isActive: true,
    },
  })

  const clothingCategory = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      level: 0,
      order: 2,
      isActive: true,
    },
  })

  const homeCategory = await prisma.category.upsert({
    where: { slug: 'home-garden' },
    update: {},
    create: {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home improvement and garden supplies',
      level: 0,
      order: 3,
      isActive: true,
    },
  })

  // Create subcategories (level 1)
  const smartphonesCategory = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories',
      level: 1,
      order: 1,
      isActive: true,
      parentId: electronicsCategory.id,
    },
  })

  const laptopsCategory = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Portable computers and accessories',
      level: 1,
      order: 2,
      isActive: true,
      parentId: electronicsCategory.id,
    },
  })

  const mensClothingCategory = await prisma.category.upsert({
    where: { slug: 'mens-clothing' },
    update: {},
    create: {
      name: 'Men\'s Clothing',
      slug: 'mens-clothing',
      description: 'Clothing for men',
      level: 1,
      order: 1,
      isActive: true,
      parentId: clothingCategory.id,
    },
  })

  const womensClothingCategory = await prisma.category.upsert({
    where: { slug: 'womens-clothing' },
    update: {},
    create: {
      name: 'Women\'s Clothing',
      slug: 'womens-clothing',
      description: 'Clothing for women',
      level: 1,
      order: 2,
      isActive: true,
      parentId: clothingCategory.id,
    },
  })

  // Create sub-subcategories (level 2)
  const androidPhonesCategory = await prisma.category.upsert({
    where: { slug: 'android-phones' },
    update: {},
    create: {
      name: 'Android Phones',
      slug: 'android-phones',
      description: 'Android-based smartphones',
      level: 2,
      order: 1,
      isActive: true,
      parentId: smartphonesCategory.id,
    },
  })

  const iphonesCategory = await prisma.category.upsert({
    where: { slug: 'iphones' },
    update: {},
    create: {
      name: 'iPhones',
      slug: 'iphones',
      description: 'Apple smartphones',
      level: 2,
      order: 2,
      isActive: true,
      parentId: smartphonesCategory.id,
    },
  })

  // Create some sample attributes
  await prisma.attribute.upsert({
    where: { 
      id: 'attr-1'
    },
    update: {},
    create: {
      id: 'attr-1',
      name: 'Color',
      value: 'Red',
      categoryId: mensClothingCategory.id,
    },
  })

  await prisma.attribute.upsert({
    where: { 
      id: 'attr-2'
    },
    update: {},
    create: {
      id: 'attr-2',
      name: 'Size',
      value: 'Large',
      categoryId: mensClothingCategory.id,
    },
  })

  await prisma.attribute.upsert({
    where: { 
      id: 'attr-3'
    },
    update: {},
    create: {
      id: 'attr-3',
      name: 'Brand',
      value: 'Samsung',
      categoryId: androidPhonesCategory.id,
    },
  })

  await prisma.attribute.upsert({
    where: { 
      id: 'attr-4'
    },
    update: {},
    create: {
      id: 'attr-4',
      name: 'Storage',
      value: '128GB',
      categoryId: androidPhonesCategory.id,
    },
  })

  // Create sample sliders
  const slider1 = await prisma.slider.upsert({
    where: { id: 'slider-1' },
    update: {},
    create: {
      id: 'slider-1',
      title: 'به فروشگاه آنلاین ما خوش آمدید',
      link: '/products',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      order: 1,
      isActive: true,
    },
  })

  const slider2 = await prisma.slider.upsert({
    where: { id: 'slider-2' },
    update: {},
    create: {
      id: 'slider-2',
      title: 'محصولات با کیفیت و قیمت مناسب',
      link: '/products',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      order: 2,
      isActive: true,
    },
  })

  const slider3 = await prisma.slider.upsert({
    where: { id: 'slider-3' },
    update: {},
    create: {
      id: 'slider-3',
      title: 'ارسال سریع و رایگان',
      imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      order: 3,
      isActive: true,
    },
  })

  console.log('Hierarchical categories and sliders created successfully!')
  console.log({ 
    adminUser, 
    rootCategories: [electronicsCategory, clothingCategory, homeCategory],
    subCategories: [smartphonesCategory, laptopsCategory, mensClothingCategory, womensClothingCategory],
    subSubCategories: [androidPhonesCategory, iphonesCategory],
    sliders: [slider1, slider2, slider3]
  })
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
