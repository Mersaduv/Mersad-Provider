const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔐 Testing NextAuth authentication...');
    
    // Simulate the authorize function from NextAuth
    const credentials = {
      email: 'admin@example.com',
      password: 'admin123'
    };
    
    console.log('📧 Testing with credentials:', credentials.email);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: credentials.email
      }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('👤 Role:', user.role);
    
    // Check if user is admin
    if (user.role !== "ADMIN") {
      console.log('❌ User is not admin');
      return;
    }
    
    console.log('✅ User is admin');
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password
    );
    
    if (!isPasswordValid) {
      console.log('❌ Password is invalid');
      return;
    }
    
    console.log('✅ Password is valid');
    
    // Return user object (like NextAuth would)
    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    
    console.log('🎉 Authentication successful!');
    console.log('👤 Authenticated user:', authUser);
    
  } catch (error) {
    console.error('❌ Error testing auth:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
