"use client";

import { useOrderModal } from "@/contexts/OrderModalContext";

interface OrderButtonProps {
  productId: string;
  productName: string;
  productPrice?: number;
  userId?: string;
}

export function OrderButton({ productId, productName, productPrice, userId }: OrderButtonProps) {
  const { openModal } = useOrderModal();

  return (
    <button
      onClick={() => openModal(productId, productName, userId, productPrice)}
      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 space-x-reverse"
    >
      {/* <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
      </svg> */}
      <div className="text-2xl">خرید قیمت دلخواه</div>
    </button>
  );
}
