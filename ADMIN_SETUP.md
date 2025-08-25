# Admin Authentication System Setup

This project includes a complete admin-only authentication system with no public registration. Here's how to set it up and use it.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Next.js 15+

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important:** Replace the placeholder values with your actual database credentials and generate a secure secret key.

### 3. Database Setup

Run the database migrations:

```bash
npx prisma migrate dev
```

### 4. Seed the Database

Create an admin user and sample data:

```bash
npm run seed
```

This will create:
- Admin user: `admin@example.com` / `admin123`
- Sample categories (Electronics, Clothing)
- Sample attributes linked to categories

### 5. Start the Development Server

```bash
npm run dev
```

## Usage

### Admin Login

1. Navigate to `/admin/login`
2. Use the credentials from the seed:
   - Email: `admin@example.com`
   - Password: `admin123`

### Admin Dashboard

After successful login, you'll be redirected to `/admin/dashboard` where you can:

- **Manage Categories**: Create, edit, and delete product categories
- **Manage Attributes**: Create, edit, and delete attributes linked to specific categories

### Features

- **Secure Authentication**: Admin-only access with password hashing
- **Category Management**: Full CRUD operations for product categories
- **Attribute Management**: Attributes linked to categories with full CRUD operations
- **Protected Routes**: Middleware protection for all admin routes
- **No Public Registration**: Only pre-created admin users can access the system

## Security Features

- Password hashing with bcrypt
- JWT-based sessions
- Route protection middleware
- Role-based access control
- No public user registration

## API Endpoints

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Attributes
- `GET /api/attributes` - List all attributes with category info
- `POST /api/attributes` - Create new attribute
- `PUT /api/attributes/[id]` - Update attribute
- `DELETE /api/attributes/[id]` - Delete attribute

## Customization

### Adding New Admin Users

To add more admin users, you can either:

1. **Modify the seed script** and re-run it
2. **Use Prisma Studio** to manually add users
3. **Create a separate admin creation script**

### Changing Admin Credentials

Update the seed script with new credentials and re-run:

```bash
npm run seed
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**: Verify your DATABASE_URL in `.env.local`
2. **Migration Errors**: Ensure your database is running and accessible
3. **Authentication Issues**: Check that NEXTAUTH_SECRET is set correctly
4. **Seed Errors**: Make sure the database schema is up to date

### Reset Database

If you need to start fresh:

```bash
npx prisma migrate reset
npm run seed
```

## Production Deployment

For production deployment:

1. Set `NEXTAUTH_URL` to your production domain
2. Use a strong, unique `NEXTAUTH_SECRET`
3. Ensure your database is properly secured
4. Consider using environment-specific database URLs
5. Enable HTTPS in production

## Support

If you encounter any issues, check:
1. Database connection and schema
2. Environment variables
3. Console logs for error messages
4. Network tab for API request failures
