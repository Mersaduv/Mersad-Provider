"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import dynamic from "next/dynamic";

interface Article {
  id: string;
  title: string;
  description: string;
  slug: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const CustomCKEditor = dynamic(
  () => import("@/components/CKEditor"),
  { ssr: false } 
);

export default function ArticlesManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      router.push("/admin/login");
      return;
    }

    fetchArticles();
  }, [session, status, router]);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles");
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟")) {
      return;
    }

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArticles(articles.filter(a => a.id !== articleId));
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">مدیریت مقالات</h1>
              <p className="text-gray-600 mt-2">ایجاد، ویرایش و حذف مقالات</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-5 h-5 ml-1" />
                مقاله جدید
              </Button>
              <Link href="/admin/dashboard">
                <Button variant="outline">
                  بازگشت به داشبورد
                </Button>
              </Link>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عنوان مقاله
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نامک (Slug)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ترتیب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاریخ ایجاد
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {article.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {article.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          article.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {article.isActive ? 'فعال' : 'غیرفعال'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingArticle(article)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Edit className="w-4 h-4 ml-1" />
                            ویرایش
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <Trash2 className="w-4 h-4 ml-1" />
                            حذف
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create/Edit Form Modal */}
          {(showCreateForm || editingArticle) && (
            <ArticleForm
              article={editingArticle}
              onClose={() => {
                setShowCreateForm(false);
                setEditingArticle(null);
              }}
              onSuccess={() => {
                setShowCreateForm(false);
                setEditingArticle(null);
                fetchArticles();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Article Form Component
function ArticleForm({ 
  article, 
  onClose, 
  onSuccess 
}: { 
  article: Article | null; 
  onClose: () => void; 
  onSuccess: () => void; 
}) {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    description: article?.description || "",
    isActive: article?.isActive !== undefined ? article.isActive : true,
    order: article?.order || 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = article ? `/api/articles/${article.id}` : "/api/articles";
      const method = article ? "PUT" : "POST";

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
        // Handle error response
        const errorData = await response.json();
        alert(`خطا در ذخیره مقاله: ${errorData.error || 'خطای نامشخص'}`);
      }
    } catch (error) {
      console.error("Error saving article:", error);
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {article ? "ویرایش مقاله" : "مقاله جدید"}
            </h2>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان مقاله *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
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
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محتوای مقاله *
              </label>
              <CustomCKEditor
                value={formData.description}
                onChange={(data) => setFormData({ ...formData, description: data })}
                placeholder="محتوای کامل مقاله را وارد کنید..."
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                انصراف
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? "در حال ذخیره..." : (article ? "به‌روزرسانی" : "ایجاد")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
