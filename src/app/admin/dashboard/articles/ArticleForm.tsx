"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { generateSlug } from "@/lib/utils";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

const CustomCKEditor = dynamic(() => import("@/components/CKEditor"), { ssr: false });

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
  order: number;
}

interface ArticleFormProps {
  heading: string;
  initialArticle?: AdminArticle;
  submitLabel?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ArticleForm({
  heading,
  initialArticle,
  submitLabel,
  onCancel,
  onSuccess,
}: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: initialArticle?.title ?? "",
    slug: initialArticle?.slug ?? "",
    description: initialArticle?.description ?? "",
    isActive: initialArticle?.isActive ?? true,
    order: initialArticle?.order ?? 0,
  });
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(initialArticle);
  const resolvedSubmitLabel = submitLabel ?? (isEditMode ? "به‌روزرسانی" : "ایجاد");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode ? `/api/articles/${initialArticle?.id}` : "/api/articles";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        alert(`خطا در ذخیره مقاله: ${errorData.error || "خطای نامشخص"}`);
      }
    } catch (error) {
      console.error("Error saving article:", error);
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? "جزئیات مقاله را اصلاح کنید." : "اطلاعات مقاله جدید را تکمیل کنید."}
            </p>
          </div>
          <Button variant="outline" onClick={onCancel}>
            انصراف
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عنوان مقاله *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نامک (Slug) *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    slug: event.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">محتوای مقاله *</label>
            <CustomCKEditor
              value={formData.description}
              onChange={(data) => setFormData((prev) => ({ ...prev, description: data }))}
              placeholder="محتوای کامل مقاله را وارد کنید..."
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ترتیب نمایش</label>
              <input
                type="number"
                value={formData.order}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: Number(event.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <ToggleSwitch
              id="article-isActive"
              checked={formData.isActive}
              onChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: checked,
                }))
              }
              label="نمایش مقاله"
              description="با غیرفعال کردن، مقاله در وب‌سایت نمایش داده نخواهد شد."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              انصراف
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "در حال ذخیره..." : resolvedSubmitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

