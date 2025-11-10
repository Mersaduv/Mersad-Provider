"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { generateSlug } from "@/lib/utils";
import { ToggleSwitch } from "@/components/ui/toggle-switch";

const CustomCKEditor = dynamic(() => import("@/components/CKEditor"), { ssr: false });

export interface ProductCategoryOption {
  id: string;
  name: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrls: string[];
  categoryId: string;
  bestSelling: boolean;
}

interface ProductFormProps {
  heading: string;
  submitLabel?: string;
  categories: ProductCategoryOption[];
  initialProduct?: AdminProduct;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ProductForm({
  heading,
  submitLabel,
  categories,
  initialProduct,
  onCancel,
  onSuccess,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialProduct?.name ?? "",
    slug: initialProduct?.slug ?? "",
    description: initialProduct?.description ?? "",
    imageUrls: initialProduct?.imageUrls ?? [],
    categoryId: initialProduct?.categoryId ?? "",
    bestSelling: initialProduct?.bestSelling ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const isEditMode = Boolean(initialProduct);
  const resolvedSubmitLabel = submitLabel ?? (isEditMode ? "به‌روزرسانی" : "ایجاد");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode ? `/api/products/${initialProduct?.id}` : "/api/products";
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
        alert(`خطا در ذخیره محصول: ${errorData.error || "خطای نامشخص"}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const removeImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    setUploadMessage("");

    try {
      let uploadedCount = 0;
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];

        const payload = new FormData();
        payload.append("file", file);
        payload.append("type", "products");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: payload,
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            uploadedCount += 1;
            setFormData((prev) => ({
              ...prev,
              imageUrls: [...prev.imageUrls, result.imagePath],
            }));
          } else {
            alert(`آپلود تصویر ناموفق بود: ${result.error}`);
          }
        } else {
          const errorData = await response.json();
          alert(`آپلود تصویر ناموفق بود: ${errorData.error}`);
        }
      }

      if (uploadedCount > 0) {
        setUploadMessage(`${uploadedCount} تصویر با موفقیت آپلود شد`);
        setTimeout(() => setUploadMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("خطا در آپلود تصاویر");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode
                ? "جزئیات محصول را به‌روزرسانی کنید."
                : "اطلاعات محصول جدید را تکمیل کنید."}
            </p>
          </div>
          <Button variant="outline" onClick={onCancel}>
            انصراف
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام محصول *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(event) => handleNameChange(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نامک (Slug) *
              </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات *
            </label>
            <CustomCKEditor
              value={formData.description}
              onChange={(data) => setFormData((prev) => ({ ...prev, description: data }))}
              placeholder="توضیحات کامل محصول را وارد کنید..."
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                دسته‌بندی *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: event.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                وضعیت محصول
              </label>
              <ToggleSwitch
                id="product-bestSelling"
                checked={formData.bestSelling}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    bestSelling: checked,
                  }))
                }
                label="نمایش در محصولات پرفروش"
                description="در صورت فعال بودن، محصول در اسلایدر پرفروش‌ترین‌ها نمایش داده می‌شود."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصاویر محصول
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">تصاویر را انتخاب کنید</p>
                </div>

                <div className="flex justify-center">
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    انتخاب فایل
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => event.target.files && handleFileUpload(event.target.files)}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {uploading ? (
                  <p className="text-sm text-blue-600">در حال آپلود...</p>
                ) : uploadMessage ? (
                  <p className="text-sm text-green-600">{uploadMessage}</p>
                ) : null}

                <p className="text-xs text-gray-500">
                  فرمت‌های مجاز: JPEG, PNG, GIF, WebP (حداکثر 5MB)
                </p>
              </div>
            </div>

            {formData.imageUrls.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">تصاویر آپلود شده:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.imageUrls.map((url, index) => (
                    <div key={url} className="relative group">
                      <Image
                        src={url}
                        alt={`تصویر ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                        width={96}
                        height={96}
                      />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6  pt-1 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "در حال ذخیره..." : uploading ? "در حال آپلود..." : resolvedSubmitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

