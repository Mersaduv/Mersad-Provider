"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface Slider {
  id: string;
  title: string;
  link?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SlidersManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    imageUrl: "",
    order: 0,
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }

    fetchSliders();
  }, [session, status, router]);

  const fetchSliders = async () => {
    try {
      const response = await fetch("/api/sliders");
      if (response.ok) {
        const data = await response.json();
        setSliders(data);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSlider 
        ? `/api/sliders/${editingSlider.id}`
        : "/api/sliders";
      
      const method = editingSlider ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSliders();
        setShowAddForm(false);
        setEditingSlider(null);
        setFormData({
          title: "",
          link: "",
          imageUrl: "",
          order: 0,
          isActive: true,
        });
      }
    } catch (error) {
      console.error("Error saving slider:", error);
    }
  };

  const handleEdit = (slider: Slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      link: slider.link || "",
      imageUrl: slider.imageUrl,
      order: slider.order,
      isActive: slider.isActive,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این اسلایدر را حذف کنید؟")) {
      return;
    }

    try {
      const response = await fetch(`/api/sliders/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchSliders();
      }
    } catch (error) {
      console.error("Error deleting slider:", error);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingSlider(null);
    setFormData({
      title: "",
      link: "",
      imageUrl: "",
      order: 0,
      isActive: true,
    });
    setUploadMessage("");
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setUploadMessage("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "sliders");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setFormData(prev => ({ ...prev, imageUrl: result.imagePath }));
          setUploadMessage("تصویر با موفقیت آپلود شد");
          setTimeout(() => setUploadMessage(""), 3000);
        } else {
          alert(`آپلود تصویر ناموفق بود: ${result.error}`);
        }
      } else {
        const errorData = await response.json();
        alert(`آپلود تصویر ناموفق بود: ${errorData.error}`);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت اسلایدر</h1>
          <p className="text-gray-600 mt-2">مدیریت اسلایدرهای صفحه اصلی</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/dashboard">
            <Button variant="outline">بازگشت به داشبورد</Button>
          </Link>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            افزودن اسلایدر جدید
          </Button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">
            {editingSlider ? "ویرایش اسلایدر" : "افزودن اسلایدر جدید"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  لینک (اختیاری)
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تصویر اسلایدر
              </label>
              
              {/* Image Upload Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="image-upload" 
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <div className="text-blue-600">
                          <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">در حال آپلود...</p>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <svg className="w-12 h-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">کلیک کنید</span> یا تصویر را بکشید
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF تا 5MB</p>
                        </div>
                      )}
                    </div>
                    <input 
                      id="image-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Upload Message */}
                {uploadMessage && (
                  <div className={`text-sm p-2 rounded ${
                    uploadMessage.includes("موفقیت") 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {uploadMessage}
                  </div>
                )}

                {/* Current Image Preview */}
                {formData.imageUrl && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تصویر فعلی:
                    </label>
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <Image
                        src={formData.imageUrl}
                        alt="Slider preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      حذف تصویر
                    </button>
                  </div>
                )}

                {/* Manual URL Input (Alternative) */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    یا آدرس تصویر را وارد کنید:
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg یا /uploads/sliders/image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ترتیب نمایش
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                  فعال
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!formData.title || !formData.imageUrl || uploading}
              >
                {uploading ? "در حال آپلود..." : (editingSlider ? "ویرایش" : "افزودن")}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                انصراف
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">لیست اسلایدرها</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تصویر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عنوان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  لینک
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ترتیب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sliders.map((slider) => (
                <tr key={slider.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-16 w-24 relative">
                      <Image
                        src={slider.imageUrl}
                        alt={slider.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {slider.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {slider.link ? (
                      <a 
                        href={slider.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        مشاهده لینک
                      </a>
                    ) : (
                      "ندارد"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {slider.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      slider.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {slider.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(slider)}
                      >
                        ویرایش
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(slider.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        حذف
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sliders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              هیچ اسلایدری یافت نشد
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
