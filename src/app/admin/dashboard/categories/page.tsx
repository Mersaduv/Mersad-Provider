"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image: string | null;
  level: number;
  order: number;
  isActive: boolean;
  parentId: string | null;
  parent?: {
    id: string;
    name: string;
    slug: string;
    level: number;
  };
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
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    image: "",
    level: 0,
    order: 0,
    isActive: true,
    parentId: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Refs for auto-focus
  const nameInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }

    fetchCategories();
  }, [session, status, router]);

  // Auto-focus effect when form is shown
  useEffect(() => {
    if (showForm && nameInputRef.current) {
      // Small delay to ensure the form is rendered
      setTimeout(() => {
        nameInputRef.current?.focus();
        // Scroll to form
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showForm]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "categories");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({ ...prev, image: result.imagePath }));
      } else {
        const errorData = await response.json();
        alert(`آپلود ناموفق بود: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("آپلود تصویر ناموفق بود");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `/api/categories/${editingId}` 
        : "/api/categories";
      
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
          level: parseInt(formData.level.toString()),
          order: parseInt(formData.order.toString()),
        }),
      });

      if (response.ok) {
        setFormData({ name: "", description: "", slug: "", image: "", level: 0, order: 0, isActive: true, parentId: "" });
        setShowForm(false);
        setEditingId(null);
        fetchCategories();
      } else {
        const errorData = await response.json();
        alert(`خطا: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      image: category.image || "",
      level: category.level,
      order: category.order,
      isActive: category.isActive,
      parentId: category.parentId || ""
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟")) return;
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories();
      } else {
        const errorData = await response.json();
        alert(`خطا: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", slug: "", image: "", level: 0, order: 0, isActive: true, parentId: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const getLevelIndicator = (level: number) => {
    return "—".repeat(level) + (level > 0 ? " " : "");
  };

  const getAvailableParents = (currentId?: string) => {
    return categories.filter(cat => 
      cat.id !== currentId && 
      cat.level < 3 && // Maximum 4 levels (0, 1, 2, 3)
      cat.isActive
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              مدیریت دسته‌بندی‌ها
            </h1>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                افزودن دسته‌بندی جدید
              </Button>
              <Link href="/admin/dashboard">
                <Button variant="outline">بازگشت به داشبورد</Button>
              </Link>
            </div>
          </div>

          {showForm && (
            <div ref={formRef} className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نام *
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نامک (Slug) *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات *
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تصویر دسته‌بندی
                  </label>
                  
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          تصویر را انتخاب کنید
                        </p>
                      </div>
                      
                      <div className="flex justify-center">
                        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                          {uploading ? "در حال آپلود..." : formData.image ? "تغییر تصویر" : "انتخاب فایل"}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                      </div>
                      
                      {uploading && (
                        <p className="text-sm text-blue-600">در حال آپلود...</p>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        فرمت‌های مجاز: JPEG, PNG, GIF, WebP (حداکثر 5MB)
                      </p>
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {formData.image && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">تصویر آپلود شده:</h4>
                      <div className="relative inline-block group">
                        <img
                          src={formData.image}
                          alt="پیش‌نمایش دسته‌بندی"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: "" })}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 pt-0.5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      دسته‌بندی والد
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.parentId}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    >
                      <option value="">بدون والد (دسته‌بندی اصلی)</option>
                      {getAvailableParents(editingId || undefined).map((category) => (
                        <option key={category.id} value={category.id}>
                          {getLevelIndicator(category.level)}{category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      سطح
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    />
                    <p className="text-xs text-gray-500 mt-1">بر اساس والد به صورت خودکار محاسبه می‌شود</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ترتیب
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="mr-2"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    فعال
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingId ? "بروزرسانی" : "ایجاد"}
                  </Button>
                  <Button type="button" onClick={handleCancel} variant="outline">
                    انصراف
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {category.image && (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {getLevelIndicator(category.level)}{category.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              سطح {category.level}
                            </span>
                            {!category.isActive && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                غیرفعال
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {category.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        نامک: <code className="bg-gray-100 px-1 rounded">{category.slug}</code>
                        {category.parent && (
                          <span className="ml-2">
                            والد: {category.parent.name}
                          </span>
                        )}
                        {category._count.children > 0 && (
                          <span className="ml-2">
                            زیرمجموعه: {category._count.children}
                          </span>
                        )}
                        {category._count.products > 0 && (
                          <span className="ml-2">
                            محصولات: {category._count.products}
                          </span>
                        )}
                        {category._count.attributes > 0 && (
                          <span className="ml-2">
                            ویژگی‌ها: {category._count.attributes}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ترتیب: {category.order} | ایجاد شده: {new Date(category.createdAt).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(category)}
                        variant="outline"
                        size="sm"
                      >
                        ویرایش
                      </Button>
                      <Button
                        onClick={() => handleDelete(category.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={category._count.children > 0 || category._count.products > 0}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
