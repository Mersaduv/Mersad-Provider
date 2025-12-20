import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductSiteItems } from "@/components/ProductSiteItems";
import { ProductTabs } from "@/components/ProductTabs";
import ParentCategoryProductSlider from "@/components/ParentCategoryProductSlider";
import { OrderButton } from "@/components/OrderButton";
import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    return {
      title: "محصول یافت نشد - سامانه ارائه دهنده",
      description: "محصول مورد نظر یافت نشد",
    };
  }

  const title = `${product.name} - ${product.category.name} - سامانه ارائه دهنده`;
  const description = product.description 
    ? `${product.description.substring(0, 160)}...` 
    : `مشاهده جزئیات محصول ${product.name} در دسته بندی ${product.category.name}`;

  return {
    title,
    description,
    keywords: [product.name, product.category.name, "محصول", "خرید", "فروشگاه"],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fa_IR",
      images: product.imageUrls && product.imageUrls.length > 0 ? [
        {
          url: product.imageUrls[0],
          width: 800,
          height: 600,
          alt: product.name,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.imageUrls && product.imageUrls.length > 0 ? [product.imageUrls[0]] : [],
    },
  };
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
    },
    include: {
      category: {
        include: {
          attributes: true,
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
              level: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Get category hierarchy for breadcrumb - optimized single query
  const getCategoryHierarchy = async (
    categoryId: string
  ): Promise<string[]> => {
    // Fetch category with all parents in a single query using recursive CTE-like approach
    // We'll use a more efficient approach by fetching the category tree
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { 
        parent: {
          include: {
            parent: {
              include: {
                parent: {
                  include: {
                    parent: true // Support up to 5 levels
                  }
                }
              }
            }
          }
        }
      },
    });

    if (!category) return [];

    const hierarchy: string[] = [];
    let currentCategory: typeof category | null = category;

    // Build hierarchy by traversing up the parent chain
    while (currentCategory) {
      hierarchy.unshift(currentCategory.name);
      currentCategory = currentCategory.parent;
    }

    return hierarchy;
  };

  const categoryHierarchy = await getCategoryHierarchy(product.categoryId);

  // Transform the product data to match the expected interface
  const transformedProduct = {
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: {
      id: product.category.id,
      name: product.category.name,
      attributes: product.category.attributes || [],
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-indigo-800 text-white py-3">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2 space-x-reverse">
              <li>
                <Link href="/" className="hover:text-yellow-300 transition-colors" prefetch={true}>
                  خانه
                </Link>
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
        <div
          style={{ backgroundImage: `url(/images/bgprod.jpeg)` }}
          className="bg-white shadow-lg rounded-lg p-6 mb-8 relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-indigo-400 rounded-full blur-2xl"></div>
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
                <span className="inline-block bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm font-medium mb-3">
                  {product.category.name}
                </span>
                <div className="border-2 border-indigo-600 flex justify-center items-center p-4 rounded-2xl">
                  <h1 className="text-3xl text-center font-bold text-gray-500 leading-tight line-clamp-3 overflow-hidden text-ellipsis">
                    {product.name}
                  </h1>
                </div>
              </div>
              <hr className="my-10" />
              <div className="">
                <OrderButton
                  productId={product.id}
                  productName={product.name}
                  productPrice={product.price ?? undefined}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Site Items */}
        <ProductSiteItems />

        {/* Product Information Tabs */}
        <ProductTabs product={transformedProduct} />

        {/* Related Products Slider */}
        <ParentCategoryProductSlider
          categoryId={product.categoryId}
          categoryName={product.category.name}
          categorySlug={product.category.slug}
          title={`محصولات مرتبط با ${product.category.name}`}
          description={`محصولات مشابه از دسته‌بندی ${product.category.name} و دسته‌بندی‌های مرتبط`}
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
          limit={8}
        />
      </div>
    </div>
  );
}
