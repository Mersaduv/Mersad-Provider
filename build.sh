#!/bin/bash

# Generate Prisma Client
npx prisma generate

# Build the application
npm run build
