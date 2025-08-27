import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductSiteItems } from "@/components/ProductSiteItems";
import { ProductTabs } from "@/components/ProductTabs";

export const revalidate = 3600; // Revalidate every hour

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  // Get category hierarchy for breadcrumb
  const getCategoryHierarchy = async (
    categoryId: string
  ): Promise<string[]> => {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { parent: true },
    });

    if (!category) return [];

    const hierarchy = [category.name];
    let currentCategory = category;

    while (currentCategory.parent) {
      hierarchy.unshift(currentCategory.parent.name);
      currentCategory = currentCategory.parent;
    }

    return hierarchy;
  };

  const categoryHierarchy = await getCategoryHierarchy(product.categoryId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-blue-800 text-white py-3">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2 space-x-reverse">
              <li>
                <a href="/" className="hover:text-yellow-300 transition-colors">
                  خانه
                </a>
              </li>
              {categoryHierarchy.map((categoryName, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-gray-300 mx-2">/</span>
                  <span className="hover:text-yellow-300 transition-colors">
                    {categoryName}
                  </span>
                </li>
              ))}
              <li className="flex items-center">
                <span className="text-gray-300 mx-2">/</span>
                <span>{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Product Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-400 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-8">
            {/* Product Images */}
            <div className="w-full lg:w-1/2">
              <ProductImageGallery
                imageUrls={product.imageUrls}
                productName={product.name}
              />
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-1/2 mt-20">
              <div className="mb-6">
                <span className="inline-block bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-medium mb-3">
                  {product.category.name}
                </span>
                <div className="border-2 border-blue-600 flex justify-center items-center p-4 rounded-2xl">
                  <h1 className="text-3xl text-center font-bold text-gray-500 leading-tight line-clamp-3 overflow-hidden text-ellipsis">
                    {product.name}
                  </h1>
                </div>
              </div>
              <hr className="my-10" />
              <div className="">
                <div
                  className="w-full flex justify-center items-center p-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-2xl rounded-2xl ring-2 ring-yellow-500 outline-none"
                >
                  جهت استعلام قیمت لطفا تماس بگیرید
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Site Items */}
        <ProductSiteItems />

        {/* Product Information Tabs */}
        <ProductTabs product={product} />
      </div>
    </div>
  );
}
