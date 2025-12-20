"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminProduct, ProductCategoryOption, ProductForm } from "../../ProductForm";

interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrls: string[];
  categoryId: string;
  price?: number;
  bestSelling: boolean;
}

export default function EditProductPage() {
  const { data: session, status } = useSession();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params?.id;

  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }

    if (!productId) {
      setError("شناسه محصول نامعتبر است");
      setLoading(false);
      return;
    }

    fetchData(productId);
  }, [session, status, router, productId]);

  const fetchData = async (id: string) => {
    try {
      const [productRes, categoriesRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch("/api/categories"),
      ]);

      if (productRes.ok) {
        const productData: ProductResponse = await productRes.json();
        setProduct({
          id: productData.id,
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          imageUrls: productData.imageUrls ?? [],
          categoryId: productData.categoryId,
          price: productData.price ?? undefined,
          bestSelling: productData.bestSelling ?? false,
        });
      } else if (productRes.status === 404) {
        setError("محصول مورد نظر یافت نشد.");
      } else {
        setError("خطا در دریافت اطلاعات محصول");
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(
          categoriesData.map((category: { id: string; name: string }) => ({
            id: category.id,
            name: category.name,
          }))
        );
      } else {
        setError("خطا در دریافت دسته‌بندی‌ها");
      }
    } catch (err) {
      console.error("Error fetching product data:", err);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">در حال بارگذاری اطلاعات محصول...</div>
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
            if (productId) {
              fetchData(productId);
            }
          }}
        >
          تلاش دوباره
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-600 text-lg">محصولی برای ویرایش یافت نشد.</p>
        <button
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={() => router.push("/admin/dashboard/products")}
        >
          بازگشت به لیست محصولات
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <ProductForm
          heading="ویرایش محصول"
          categories={categories}
          initialProduct={product}
          onCancel={() => router.back()}
          onSuccess={() => router.push("/admin/dashboard/products")}
          submitLabel="به‌روزرسانی"
        />
      </div>
    </div>
  );
}

