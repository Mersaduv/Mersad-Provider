"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Order {
  id: string;
  productName: string;
  quantity: number;
  desiredPrice: number;
  status: string;
  createdAt: string;
  notes?: string;
}

const statusLabels = {
  PENDING: "در انتظار",
  CONFIRMED: "تأیید شده",
  PREPARING: "در حال آماده‌سازی",
  READY: "آماده",
  DELIVERED: "تحویل داده شده",
  CANCELLED: "لغو شده"
};

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  READY: "bg-green-100 text-green-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800"
};

export default function ProfilePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || "خطا در دریافت سفارشات");
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError("خطا در دریافت سفارشات");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">پروفایل من</h1>
          <p className="text-indigo-100 mt-2">سفارشات و اطلاعات حساب کاربری</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">سفارشات من</h2>
            <p className="text-gray-600 mt-1">تمام سفارشات ثبت شده شما</p>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
              <p className="text-gray-500 mb-4">برای ثبت سفارش، محصول مورد نظر خود را انتخاب کنید</p>
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                مشاهده محصولات
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{order.productName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">تعداد:</span>
                          <span className="mr-2">{order.quantity}</span>
                        </div>
                        <div>
                          <span className="font-medium">قیمت دلخواه:</span>
                          <span className="mr-2">{formatPrice(order.desiredPrice)} تومان</span>
                        </div>
                        <div>
                          <span className="font-medium">تاریخ سفارش:</span>
                          <span className="mr-2">{formatDate(order.createdAt)}</span>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700">توضیحات:</span>
                          <p className="text-gray-600 mt-1">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
