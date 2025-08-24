import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Revalidate every hour

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 relative">
          <div className="aspect-square relative rounded-lg overflow-hidden border">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                تصویر موجود نیست
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="mb-2">
            <span className="inline-block bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-sm">
              {product.category.name}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="text-2xl font-bold mb-6">
            {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
          </div>
          
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">توضیحات</h2>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 ml-2">وضعیت موجودی:</span>
              {product.inventory > 0 ? (
                <span className="text-green-600 font-medium">موجود</span>
              ) : (
                <span className="text-red-600 font-medium">ناموجود</span>
              )}
            </div>
            {product.inventory > 0 && (
              <div className="text-sm text-gray-500 mt-1">
                {product.inventory} عدد در انبار
              </div>
            )}
          </div>
          
          <Button size="lg" className="w-full" disabled={product.inventory <= 0}>
            {product.inventory > 0 ? "افزودن به سبد خرید" : "ناموجود"}
          </Button>
        </div>
      </div>
    </div>
  );
}
