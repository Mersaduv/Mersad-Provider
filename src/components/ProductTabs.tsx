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
    attributes: {
      id: string;
      name: string;
      value: string; // Single value field
    }[];
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
              
              {product.category.attributes && product.category.attributes.length > 0 ? (
                <div className="space-y-3">
                  {product.category.attributes.map((attribute, index) => (
                    <div 
                      key={attribute.id} 
                      className={`flex justify-between items-center py-3 px-4 rounded-lg ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                      }`}
                    >
                      <span className="text-gray-600 font-medium">{attribute.name}</span>
                      <span className="text-gray-800 font-bold">{attribute.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>مشخصات فنی برای این محصول تعریف نشده است</p>
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">توضیحات محصول</h3>
              <div 
                className="text-gray-700 leading-relaxed prose prose-lg max-w-none ck-content"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
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
                    <p className="text-sm opacity-80">ارسال از طریق پست و سرویس های انتقال دهنده سراسر افغانستان</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 ml-2">⏰</span>
                  <div>
                    <p className="font-medium">زمان تحویل</p>
                    <p className="text-sm opacity-80">بسیار سریع</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 ml-2">💰</span>
                  <div>
                    <p className="font-medium">هزینه ارسال</p>
                    <p className="text-sm opacity-80">بسته به منطقه شما</p>
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
