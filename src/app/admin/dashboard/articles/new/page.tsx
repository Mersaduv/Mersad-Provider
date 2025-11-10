"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArticleForm } from "../ArticleForm";

export default function CreateArticlePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }

    setLoading(false);
  }, [session, status, router]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <ArticleForm
          heading="ایجاد مقاله جدید"
          onCancel={() => router.back()}
          onSuccess={() => router.push("/admin/dashboard/articles")}
        />
      </div>
    </div>
  );
}

