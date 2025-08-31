const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    console.log('🔍 Checking database users...');
    
    // Check all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    console.log(`📊 Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - Created: ${user.createdAt}`);
    });
    
    // Check specific admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (adminUser) {
      console.log('\n✅ Admin user found:');
      console.log(`  Email: ${adminUser.email}`);
      console.log(`  Role: ${adminUser.role}`);
      console.log(`  Password hash: ${adminUser.password.substring(0, 20)}...`);
    } else {
      console.log('\n❌ Admin user not found!');
    }
    
    // Test password verification
    if (adminUser) {
      const bcrypt = require('bcryptjs');
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, adminUser.password);
      console.log(`\n🔐 Password test for '${testPassword}': ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
