"use client";

import ParentCategoryProductSlider from "./ParentCategoryProductSlider";

interface ParentCategorySliderDemoProps {
  categoryId: string;
  categoryName: string;
}

export default function ParentCategorySliderDemo({
  categoryId,
  categoryName,
}: ParentCategorySliderDemoProps) {
  return (
    <ParentCategoryProductSlider
      categoryId={categoryId}
      categoryName={categoryName}
      categorySlug={categoryId} // Using categoryId as slug for demo
      title={`محصولات مرتبط با ${categoryName}`}
      description={`مجموعه‌ای از بهترین محصولات در دسته‌بندی‌های مرتبط با ${categoryName}`}
      icon={
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      }
      limit={10}
    />
  );
}
