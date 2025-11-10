"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductForm, ProductCategoryOption } from "../ProductForm";

export default function CreateProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }

    fetchCategories();
  }, [session, status, router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(
          data.map((category: { id: string; name: string }) => ({
            id: category.id,
            name: category.name,
          }))
        );
      } else {
        setError("خطا در دریافت دسته‌بندی‌ها");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">در حال آماده‌سازی فرم...</div>
      </div>
    );
  }

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchCategories();
          }}
        >
          تلاش دوباره
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <ProductForm
          heading="ایجاد محصول جدید"
          categories={categories}
          onCancel={() => router.back()}
          onSuccess={() => router.push("/admin/dashboard/products")}
        />
      </div>
    </div>
  );
}

