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
    
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Welcome back, {session.user?.name || "Admin"}!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Link href="/admin/dashboard/categories">
                  <Button className="w-full h-24 text-lg bg-blue-600 hover:bg-blue-700">
                    Manage Categories
                  </Button>
                </Link>
                
                <Link href="/admin/dashboard/attributes">
                  <Button className="w-full h-24 text-lg bg-green-600 hover:bg-green-700">
                    Manage Attributes
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="bg-white hover:bg-gray-50"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
