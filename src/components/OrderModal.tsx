"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  userId?: string;
}

export function OrderModal({ isOpen, onClose, productId, productName, userId }: OrderModalProps) {
  const [formData, setFormData] = useState({
    quantity: 1,
    desiredPrice: "",
    customerPhone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [orderReceipt, setOrderReceipt] = useState<{
    id: string;
    productName: string;
    quantity: number;
    desiredPrice: number;
    status: string;
    createdAt: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productName,
          quantity: parseInt(formData.quantity.toString()),
          desiredPrice: parseFloat(formData.desiredPrice),
          customerName: "مشتری", // Default name
          customerPhone: formData.customerPhone,
          notes: "", // Empty notes
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderReceipt(data.order);
        setSubmitMessage("");
        // Reset form
        setFormData({
          quantity: 1,
          desiredPrice: "",
          customerPhone: "",
        });
        // Close modal after 5 seconds
        setTimeout(() => {
          onClose();
          setOrderReceipt(null);
        }, 5000);
      } else {
        setSubmitMessage(data.error || "خطا در ثبت سفارش");
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setSubmitMessage("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">خرید قیمت دلخواه</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-indigo-100 mt-2 text-sm">
            برای محصول: <span className="font-semibold">{productName}</span>
          </p>
        </div>

        {/* Order Receipt */}
        {orderReceipt ? (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">سفارش شما با موفقیت ثبت شد!</h3>
              <p className="text-gray-600">شماره سفارش: <span className="font-bold text-indigo-600">#{orderReceipt.id.slice(-8)}</span></p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">جزئیات سفارش:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">محصول:</span>
                  <span className="font-medium">{orderReceipt.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تعداد:</span>
                  <span className="font-medium">{orderReceipt.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">قیمت دلخواه:</span>
                  <span className="font-medium">{new Intl.NumberFormat('fa-IR').format(orderReceipt.desiredPrice)} تومان</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">وضعیت:</span>
                  <span className="text-yellow-600 font-medium">در انتظار</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">مرحله بعدی</h5>
                  <p className="text-blue-700 text-sm">به زودی با شما تماس خواهیم گرفت تا سفارش شما را تأیید کنیم.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">این پنجره در 5 ثانیه بسته خواهد شد...</p>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              تعداد مورد نظر
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Desired Price */}
          <div>
            <label htmlFor="desiredPrice" className="block text-sm font-medium text-gray-700 mb-2">
              قیمت دلخواه (تومان)
            </label>
            <input
              type="number"
              id="desiredPrice"
              name="desiredPrice"
              min="0"
              step="1000"
              value={formData.desiredPrice}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="مثال: 500000"
              required
            />
          </div>


          {/* Customer Phone */}
          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
              شماره تماس
            </label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="09123456789"
              required
            />
          </div>


          {/* Submit Message */}
          {submitMessage && (
            <div className={`p-4 rounded-lg ${
              submitMessage.includes("موفقیت") 
                ? "bg-green-100 text-green-800 border border-green-200" 
                : "bg-red-100 text-red-800 border border-red-200"
            }`}>
              {submitMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال ثبت...
                </div>
              ) : (
                "ثبت سفارش"
              )}
            </Button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
