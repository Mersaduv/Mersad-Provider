"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  if (status === "loading") {
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
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                داشبورد ادمین
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                خوش آمدید، {session.user?.name || "ادمین"}!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
                <Link href="/admin/dashboard/categories">
                  <Button className="w-full h-24 text-lg bg-blue-600 hover:bg-blue-700">
                    مدیریت دسته‌بندی‌ها
                  </Button>
                </Link>
                
                <Link href="/admin/dashboard/attributes">
                  <Button className="w-full h-24 text-lg bg-green-600 hover:bg-green-700">
                    مدیریت ویژگی‌ها
                  </Button>
                </Link>

                <Link href="/admin/dashboard/products">
                  <Button className="w-full h-24 text-lg bg-purple-600 hover:bg-purple-700">
                    مدیریت محصولات
                  </Button>
                </Link>

                <Link href="/admin/dashboard/sliders">
                  <Button className="w-full h-24 text-lg bg-orange-600 hover:bg-orange-700">
                    مدیریت اسلایدر
                  </Button>
                </Link>

                <Link href="/admin/dashboard/articles">
                  <Button className="w-full h-24 text-lg bg-indigo-600 hover:bg-indigo-700">
                    مدیریت مقالات
                  </Button>
                </Link>

                <Link href="/admin/dashboard/orders">
                  <Button className="w-full h-24 text-lg bg-red-600 hover:bg-red-700">
                    مدیریت سفارشات
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="bg-white hover:bg-gray-50"
                >
                  خروج
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}