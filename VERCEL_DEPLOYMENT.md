# Vercel Deployment Guide

## Environment Variables

Make sure to set these environment variables in your Vercel dashboard:

### Required Variables:
- `DATABASE_URL`: Your PostgreSQL database connection string
- `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)
- `NEXTAUTH_SECRET`: A random secret key for NextAuth

### Example:
```
DATABASE_URL=postgresql://username:password@host:5432/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

## Build Process

The project is configured to:
1. Generate Prisma Client during build
2. Build the Next.js application
3. Deploy to Vercel

## Database Setup

1. Create a PostgreSQL database
2. Set the `DATABASE_URL` environment variable
3. Run database migrations (if needed)

## Troubleshooting

If you encounter Prisma Client issues:
1. Check that `DATABASE_URL` is correctly set
2. Ensure the database is accessible from Vercel
3. Verify that Prisma Client is generated during build
