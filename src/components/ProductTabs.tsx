"use client";

import { useState } from "react";
import { ChevronUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrls: string[];
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    {
      id: "description",
      label: "توضیحات",
      icon: activeTab === "description" ? <ChevronUp className="w-4 h-4 text-orange-500" /> : null
    },
    {
      id: "comments",
      label: `نظرات (0)`,
      icon: null
    },
    {
      id: "shipping",
      label: "SHIPPING & DELIVERY",
      icon: null
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-6">

            {/* Product Specifications */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">مشخصات فنی محصول</h3>
              
              <div className="space-y-3">
                {/* Example specifications - you can make these dynamic based on your data */}
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">ولتاژ (Voltage):</span>
                  <span className="text-gray-800 font-bold">3V</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-gray-100 rounded-lg">
                  <span className="text-gray-600 font-medium">توان (Power):</span>
                  <span className="text-gray-800 font-bold">0.2W</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">شدت نور (Luminous Intensity):</span>
                  <span className="text-gray-800 font-bold">lm (28-30) (26-28)</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-gray-100 rounded-lg">
                  <span className="text-gray-600 font-medium">رنگ (Color):</span>
                  <span className="text-gray-800 font-bold">k (3000-6500)</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">RA:</span>
                  <span className="text-gray-800 font-bold">80</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-gray-100 rounded-lg">
                  <span className="text-gray-600 font-medium">SDCM:</span>
                  <span className="text-gray-800 font-bold">5</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">جنس پایه یا پد LED چیست:</span>
                  <span className="text-gray-800 font-bold">مس (Copper)</span>
                </div>
                
                <div className="flex justify-between items-center py-3 px-4 bg-gray-100 rounded-lg">
                  <span className="text-gray-600 font-medium">پایه مساوی یا نامساوی:</span>
                  <span className="text-gray-800 font-bold">نامساوی (Unequal)</span>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">توضیحات محصول</h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </div>
        );
      
      case "comments":
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💬</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">هنوز نظری ثبت نشده</h3>
            <p className="text-gray-500">اولین نفری باشید که نظر می‌دهد</p>
          </div>
        );
      
      case "shipping":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4">اطلاعات ارسال و تحویل</h3>
              <div className="space-y-3 text-blue-700">
                <div className="flex items-start">
                  <span className="text-blue-600 ml-2">🚚</span>
                  <div>
                    <p className="font-medium">ارسال به سراسر کشور</p>
                    <p className="text-sm opacity-80">ارسال از طریق پست و تیپاکس</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 ml-2">⏰</span>
                  <div>
                    <p className="font-medium">زمان تحویل</p>
                    <p className="text-sm opacity-80">2-5 روز کاری</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 ml-2">💰</span>
                  <div>
                    <p className="font-medium">هزینه ارسال</p>
                    <p className="text-sm opacity-80">رایگان برای سفارشات بالای 500 هزار تومان</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Tab Headers */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-gray-800 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {tab.label}
                {tab.icon}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
