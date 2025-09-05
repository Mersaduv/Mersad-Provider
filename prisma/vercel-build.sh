#!/bin/bash

# This script is used by Vercel to build the project with Prisma
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo "🏗️ Building Next.js application..."
npm run build
