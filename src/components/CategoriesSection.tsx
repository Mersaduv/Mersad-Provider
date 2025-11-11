"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image: string | null;
  level: number;
  order: number;
  isActive: boolean;
  showOnHome: boolean;
  homeOrder: number;
  parentId: string | null;
  children: Array<{
    id: string;
    name: string;
    slug: string;
    level: number;
    order: number;
    isActive: boolean;
  }>;
  _count: {
    children: number;
    products: number;
    attributes: number;
  };
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?featured=true");
      if (response.ok) {
        const data = await response.json();
        // Keep only active categories marked for the homepage
        const featuredCategories = data.filter(
          (cat: Category) => cat.isActive && cat.showOnHome
        );
        const sortedCategories = [...featuredCategories].sort((a, b) => {
          if (a.homeOrder !== b.homeOrder) {
            return a.homeOrder - b.homeOrder;
          }
          return a.name.localeCompare(b.name);
        });
        setCategories(sortedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-300 rounded w-64 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded w-8 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 pb-5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            دسته‌بندی‌ها
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            محصولات متنوع ما را در دسته‌بندی‌های مختلف جستجو کنید
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              prefetch={true}
              className="group flex flex-col items-center text-center hover:scale-105 transition-all duration-300"
            >
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 mb-4 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:shadow-lg transition-all duration-300">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-7xl sm:text-9xl text-gray-400">📦</div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-center justify-center">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {category.name}
                </h3>

                <div className="flex items-center text-xs text-gray-500">
                  <span className="flex items-center">
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/products"
            prefetch={true}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            مشاهده همه محصولات
            <div className="rotate-180">
              <svg
                className="w-5 h-5 mr-2"
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
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
