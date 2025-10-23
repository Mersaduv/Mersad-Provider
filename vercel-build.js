#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Running Prisma migrations...');
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Prisma migrations completed successfully');
} catch (error) {
  console.error('❌ Error running Prisma migrations:', error.message);
  process.exit(1);
}

console.log('🔧 Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated successfully');
} catch (error) {
  console.error('❌ Error generating Prisma Client:', error.message);
  process.exit(1);
}

console.log('🌱 Seeding database...');
try {
  execSync('node seed-sample-data.js', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully');
} catch (error) {
  console.error('❌ Error seeding database:', error.message);
  process.exit(1);
}

console.log('🏗️ Building Next.js application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed successfully');
} catch (error) {
  console.error('❌ Error building Next.js application:', error.message);
  process.exit(1);
}

console.log('🎉 Build completed successfully!');
