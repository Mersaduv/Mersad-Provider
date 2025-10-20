"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  productName: string;
  quantity: number;
  desiredPrice: number;
  customerName: string;
  customerPhone: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
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

const statusOptions = [
  { value: "PENDING", label: "در انتظار" },
  { value: "CONFIRMED", label: "تأیید شده" },
  { value: "PREPARING", label: "در حال آماده‌سازی" },
  { value: "READY", label: "آماده" },
  { value: "DELIVERED", label: "تحویل داده شده" },
  { value: "CANCELLED", label: "لغو شده" }
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const url = selectedStatus 
        ? `/api/orders?status=${selectedStatus}`
        : '/api/orders';
      
      const response = await fetch(url);
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
  }, [selectedStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: string, notes: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status, notes, updatedAt: new Date().toISOString() }
              : order
          )
        );
        setEditingOrder(null);
        setNewStatus("");
        setNewNotes("");
      } else {
        setError(data.error || "خطا در به‌روزرسانی سفارش");
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setError("خطا در به‌روزرسانی سفارش");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setNewNotes(order.notes || "");
  };

  const handleSaveOrder = () => {
    if (editingOrder) {
      updateOrderStatus(editingOrder.id, newStatus, newNotes);
    }
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
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">مدیریت سفارشات</h1>
              <p className="text-gray-600 mt-1">تمام سفارشات ثبت شده توسط مشتریان</p>
            </div>
            
            {/* Status Filter */}
            <div className="mt-4 lg:mt-0">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">همه سفارشات</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ سفارشی یافت نشد</h3>
              <p className="text-gray-500">هنوز سفارشی ثبت نشده است</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  {editingOrder?.id === order.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{order.productName}</h3>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveOrder}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ذخیره
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingOrder(null)}
                          >
                            انصراف
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            وضعیت
                          </label>
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            توضیحات
                          </label>
                          <textarea
                            value={newNotes}
                            onChange={(e) => setNewNotes(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="توضیحات اضافی..."
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{order.productName}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            مشتری: {order.customerName} - {order.customerPhone}
                          </p>
                          {order.user && (
                            <p className="text-sm text-gray-500">
                              کاربر: {order.user.name} ({order.user.email})
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                            {statusLabels[order.status as keyof typeof statusLabels]}
                          </span>
                          <Button
                            onClick={() => handleEditOrder(order)}
                            variant="outline"
                            size="sm"
                          >
                            ویرایش
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
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
                        <div>
                          <span className="font-medium">آخرین به‌روزرسانی:</span>
                          <span className="mr-2">{formatDate(order.updatedAt)}</span>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="font-medium text-gray-700">توضیحات:</span>
                          <p className="text-gray-600 mt-1">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
