"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrls: string[];
  bestSelling: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    parent?: {
      id: string;
      name: string;
      slug: string;
      level: number;
    } | null;
  };
}

interface ProductSliderProps {
  title: string;
  apiEndpoint: string;
  queryParams?: Record<string, string>;
  icon?: React.ReactNode;
  description?: string;
}

export default function ProductSlider({
  title,
  apiEndpoint,
  queryParams = {},
  icon,
  description,
}: ProductSliderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(apiEndpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(`Error fetching products from ${apiEndpoint}:`, error);
      setError("خطا در بارگذاری محصولات");
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint]);

  const checkScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScrollLeft = scrollWidth - clientWidth;

      console.log("Scroll check:", {
        scrollLeft,
        scrollWidth,
        clientWidth,
        maxScrollLeft,
      });

      // Check if we can scroll in either direction
      const canLeft = scrollLeft > 1; // Can scroll left when not at start (with some tolerance)
      const canRight = scrollLeft < maxScrollLeft - 1; // Can scroll right when not at end (with some tolerance)

      console.log("Can scroll:", { canLeft, canRight });

      // If there's enough content to scroll, show both buttons
      if (maxScrollLeft > 0) {
        setCanScrollLeft(canLeft);
        setCanScrollRight(canRight);
      } else {
        // If no scrolling needed, hide both buttons
        setCanScrollLeft(false);
        setCanScrollRight(false);
      }

      // Force show both buttons if we have enough products (more than 3)
      if (products.length > 3) {
        setCanScrollLeft(true);
        setCanScrollRight(true);
      }
    }
  }, [products]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      console.log("Scrolling left, current scrollLeft:", container.scrollLeft);
      // Scroll left (backward) - move to previous items
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      console.log("Scrolling right, current scrollLeft:", container.scrollLeft);
      // Scroll right (forward) - move to next items
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    // Initial check after products load
    if (products.length > 0) {
      setTimeout(() => {
        checkScrollButtons();
        // Force check again after a longer delay to ensure DOM is fully rendered
        setTimeout(() => {
          checkScrollButtons();
        }, 500);
      }, 100);
    }

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);

      // Also check on resize
      const resizeObserver = new ResizeObserver(() => {
        checkScrollButtons();
      });
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        resizeObserver.disconnect();
      };
    }
  }, [products, checkScrollButtons]);

  if (loading) {
    return (
      <div className="w-full mb-12">
        <div className="bg-red-500 rounded-2xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded-lg w-64 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mb-12">
        <div className="bg-red-500 rounded-2xl p-8 text-center">
          <div className="text-white mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            خطا در بارگذاری
          </h3>
          <p className="text-white/80 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full mb-12">
        <div className="bg-red-500 rounded-2xl p-8 text-center">
          <div className="text-white/80 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            محصولی یافت نشد
          </h3>
          <p className="text-white/80">
            در حال حاضر محصولی برای نمایش وجود ندارد
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-12">
      {/* Main Container with Red Background */}
      <div className="bg-red-500 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Product Slider */}
          <div className="flex-1 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-start space-x-3">
                {icon && (
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg text-white">
                    {icon}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-white/80 text-sm">{description}</p>
                  )}
                </div>
              </div>
              <Link
                href={{
                  pathname: '/products',
                  query: queryParams
                }}
                className="bg-white text-red-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
              >
                <span>مشاهده همه</span>
                <svg
                  className="w-4 h-4 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Product Slider Container */}
            <div className="product-slider-container">
              {/* Navigation Buttons */}
              {canScrollLeft && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-lg transition-all duration-200"
                  aria-label="اسلاید به چپ"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {canScrollRight && (
                <button
                  onClick={scrollRight}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-lg transition-all duration-200"
                  aria-label="اسلاید به راست"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}

              {/* Horizontal Scrolling Container */}
              <div
                ref={scrollContainerRef}
                className="product-slider-scroll flex gap-4 sm:gap-5 lg:gap-6 scrollbar-hide pb-2 w-full"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {products.map((product) => {
                  // Create breadcrumb path
                  const breadcrumbPath = product.category.parent
                    ? `${product.category.parent.name} > ${product.category.name}`
                    : product.category.name;

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      prefetch={true}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group relative flex-shrink-0 w-56 sm:w-64 lg:w-72 cursor-pointer hover:scale-105"
                    >
                      {/* Product Image */}
                      <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
                        {product.imageUrls && product.imageUrls.length > 0 ? (
                          <Image
                            src={product.imageUrls[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <div className="text-center">
                              <svg
                                className="w-12 h-12 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="text-sm">تصویر موجود نیست</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Breadcrumb */}
                        <div className="mb-2">
                          <div className="flex items-center text-xs text-gray-500">
                            <svg
                              className="w-3 h-3 ml-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.723V12a1 1 0 11-2 0v-1.277l-1.254-.145a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.277l1.254.145a1 1 0 11-.992 1.736l-1.734-.99A.996.996 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a.996.996 0 01-.52.878l-1.734.99a1 1 0 11-.992-1.736L16 13.277V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v-1.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="truncate">{breadcrumbPath}</span>
                          </div>
                        </div>

                        {/* Product Title */}
                        <h3 className="font-bold text-sm text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                          {product.name}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
