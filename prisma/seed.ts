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

  // Create some sample categories
  const electronicsCategory = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
    },
  })

  const clothingCategory = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: {
      name: 'Clothing',
      description: 'Fashion and apparel',
    },
  })

  // Create some sample attributes
  await prisma.attribute.upsert({
    where: { 
      id: 'attr-1' // Using a fixed ID for upsert
    },
    update: {},
    create: {
      id: 'attr-1',
      name: 'Color',
      value: 'Red',
      categoryId: clothingCategory.id,
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
      categoryId: clothingCategory.id,
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
      categoryId: electronicsCategory.id,
    },
  })

  console.log({ adminUser, electronicsCategory, clothingCategory })
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
