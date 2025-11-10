"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleForm, AdminArticle } from "../../ArticleForm";

export default function EditArticlePage() {
  const { data: session, status } = useSession();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const articleId = params?.id;

  const [article, setArticle] = useState<AdminArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }

    if (!articleId) {
      setError("شناسه مقاله نامعتبر است");
      setLoading(false);
      return;
    }

    fetchArticle(articleId);
  }, [session, status, router, articleId]);

  const fetchArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/articles/${id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle({
          id: data.id,
          title: data.title,
          slug: data.slug,
          description: data.description,
          isActive: data.isActive ?? true,
          order: data.order ?? 0,
        });
      } else if (response.status === 404) {
        setError("مقاله مورد نظر یافت نشد.");
      } else {
        setError("خطا در دریافت اطلاعات مقاله");
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">در حال بارگذاری اطلاعات مقاله...</div>
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
            if (articleId) {
              fetchArticle(articleId);
            }
          }}
        >
          تلاش دوباره
        </button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-600 text-lg">مقاله‌ای برای ویرایش یافت نشد.</p>
        <button
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={() => router.push("/admin/dashboard/articles")}
        >
          بازگشت به لیست مقالات
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <ArticleForm
          heading="ویرایش مقاله"
          initialArticle={article}
          submitLabel="به‌روزرسانی"
          onCancel={() => router.back()}
          onSuccess={() => router.push("/admin/dashboard/articles")}
        />
      </div>
    </div>
  );
}

