import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const { category, search } = searchParams;
  
  let title = "محصولات - سامانه ارائه دهنده";
  let description = "مشاهده تمام محصولات موجود در سامانه ارائه دهنده";
  
  if (category) {
    const categoryData = await prisma.category.findUnique({
      where: { slug: category },
      select: { name: true }
    });
    
    if (categoryData) {
      title = `${categoryData.name} - محصولات - سامانه ارائه دهنده`;
      description = `مشاهده محصولات دسته بندی ${categoryData.name} در سامانه ارائه دهنده`;
    }
  }
  
  if (search) {
    title = `جستجو: ${search} - محصولات - سامانه ارائه دهنده`;
    description = `نتایج جستجو برای "${search}" در محصولات سامانه ارائه دهنده`;
  }
  
  if (category && search) {
    const categoryData = await prisma.category.findUnique({
      where: { slug: category },
      select: { name: true }
    });
    
    if (categoryData) {
      title = `جستجو: ${search} در ${categoryData.name} - محصولات - سامانه ارائه دهنده`;
      description = `نتایج جستجو برای "${search}" در دسته بندی ${categoryData.name}`;
    }
  }

  return {
    title,
    description,
    keywords: ["محصولات", "فروشگاه", "خرید", "دسته بندی", search || "", category ? "دسته بندی" : ""].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fa_IR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

interface ProductsPageProps {
  searchParams: {
    category?: string;
    page?: string;
    search?: string;
  };
}

const ITEMS_PER_PAGE = 1; // Number of products per page

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, page = "1", search } = searchParams;
  const currentPage = parseInt(page, 10) || 1;

  // Build the where clause for filtering
  const whereClause: {
    categoryId?: string;
    OR?: Array<{
      name?: { contains: string; mode: 'insensitive' };
      description?: { contains: string; mode: 'insensitive' };
    }>;
  } = {};
  
  if (category) {
    // Find category by slug first, then use its ID
    const categoryData = await prisma.category.findUnique({
      where: { slug: category },
      select: { id: true }
    });
    
    if (categoryData) {
      whereClause.categoryId = categoryData.id;
    }
  }
  
  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive' as const,
        },
      },
      {
        description: {
          contains: search,
          mode: 'insensitive' as const,
        },
      },
    ];
  }

  // Get total count for pagination
  const totalProducts = await prisma.product.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Get products with pagination
  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip,
    take: ITEMS_PER_PAGE,
  });

  // Get category name if filtering by category
  let categoryName = null;
  if (category) {
    const categoryData = await prisma.category.findUnique({
      where: { slug: category },
      select: { name: true }
    });
    categoryName = categoryData?.name;
  }

  // Prepare search params for pagination
  const paginationSearchParams: Record<string, string> = {};
  if (category) {
    paginationSearchParams.category = category;
  }
  if (search) {
    paginationSearchParams.search = search;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-indigo-900 text-white py-3">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2 ">
              <li>
                <Link href="/" className="hover:text-yellow-300 transition-colors">خانه</Link>
              </li>
              <li className="text-gray-300">/</li>
              <li>
                <Link href="/products" className="hover:text-yellow-300 transition-colors">محصولات</Link>
              </li>
              {categoryName && (
                <>
                  <li className="text-gray-300">/</li>
                  <li>{categoryName}</li>
                </>
              )}
              {search && (
                <>
                  <li className="text-gray-300">/</li>
                  <li>جستجو: {search}</li>
                </>
              )}
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results info */}
        <div className="mb-6 text-center text-gray-600">
          <p>
            {categoryName && ` در دسته بندی "${categoryName}"`}
            {search && ` برای جستجوی "${search}"`}
            {categoryName && search && ' و '}
          </p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">
              {categoryName && search 
                ? `محصولی در دسته بندی "${categoryName}" برای جستجوی "${search}" یافت نشد`
                : categoryName 
                ? `محصولی در دسته بندی "${categoryName}" یافت نشد`
                : search
                ? `محصولی برای جستجوی "${search}" یافت نشد`
                : 'محصولی یافت نشد'
              }
            </p>
            <p className="text-sm text-gray-400">لطفاً بعداً مراجعه کنید یا با پشتیبانی تماس بگیرید.</p>
            {(categoryName || search) && (
              <Link href="/products">
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  مشاهده همه محصولات
                </button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  description={product.description}
                  imageUrls={product.imageUrls}
                  categoryName={product.category.name}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/products"
              searchParams={paginationSearchParams}
            />
          </>
        )}
      </div>
    </div>
  );
}
