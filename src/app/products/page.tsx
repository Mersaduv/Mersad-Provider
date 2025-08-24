import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">محصولات</h1>
      
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
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl || undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
