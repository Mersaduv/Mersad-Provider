"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Attribute {
  id: string;
  name: string;
  value: string; // Reverted back to single value
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

export default function AttributesManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    value: "", // Reverted back to single value
    categoryId: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Refs for auto-focus
  const nameInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }

    fetchData();
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

  const fetchData = async () => {
    try {
      const [attributesResponse, categoriesResponse] = await Promise.all([
        fetch("/api/attributes"),
        fetch("/api/categories")
      ]);

      if (attributesResponse.ok) {
        const attributesData = await attributesResponse.json();
        setAttributes(attributesData);
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.value || !formData.categoryId) {
      alert("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    try {
      const url = editingId 
        ? `/api/attributes/${editingId}` 
        : "/api/attributes";
      
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", value: "", categoryId: "" });
        setShowForm(false);
        setEditingId(null);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`خطا: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving attribute:", error);
    }
  };

  const handleEdit = (attribute: Attribute) => {
    setFormData({
      name: attribute.name,
      value: attribute.value,
      categoryId: attribute.categoryId
    });
    setEditingId(attribute.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این ویژگی را حذف کنید؟")) return;
    
    try {
      const response = await fetch(`/api/attributes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`خطا: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting attribute:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", value: "", categoryId: "" });
    setShowForm(false);
    setEditingId(null);
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
              مدیریت ویژگی‌ها
            </h1>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                افزودن ویژگی جدید
              </Button>
              <Link href="/admin/dashboard">
                <Button variant="outline">بازگشت به داشبورد</Button>
              </Link>
            </div>
          </div>

          {showForm && (
            <div ref={formRef} className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? "ویرایش ویژگی" : "افزودن ویژگی جدید"}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مقدار *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
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
              {attributes.map((attribute) => (
                <li key={attribute.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {attribute.name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        مقدار: <span className="font-medium">{attribute.value}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        دسته‌بندی: {attribute.category.name} | ایجاد شده: {new Date(attribute.createdAt).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(attribute)}
                        variant="outline"
                        size="sm"
                      >
                        ویرایش
                      </Button>
                      <Button
                        onClick={() => handleDelete(attribute.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
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
