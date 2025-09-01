import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every hour

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-purple-900 text-white py-3">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2 ">
              <li>
                <Link href="/" className="hover:text-yellow-300 transition-colors">خانه</Link>
              </li>
              <li className="text-gray-300">/</li>
              <li>محصولات</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">محصولات</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">محصولی یافت نشد</p>
            <p className="text-sm text-gray-400">لطفاً بعداً مراجعه کنید یا با پشتیبانی تماس بگیرید.</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
