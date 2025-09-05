import Slider from "@/components/Slider";
import ProductSlider from "@/components/ProductSlider";
import CategoriesSection from "@/components/CategoriesSection";
import ArticlesSection from "@/components/ArticlesSection";
import { Metadata } from "next";
import AboutSection from "@/components/AboutSection";

export const metadata: Metadata = {
  title: "خانه - شرکت بازرگانی مرصاد",
  description:
    "به پروژه Next.js + Prisma + Vercel Postgres خوش آمدید. این یک پروژه نمونه با پشتیبانی از زبان فارسی و چینش راست به چپ است.",
  keywords: ["Next.js", "Prisma", "Vercel Postgres", "فارسی", "پروژه نمونه"],
  openGraph: {
    title: "خانه - شرکت بازرگانی مرصاد",
    description: "به پروژه Next.js + Prisma + Vercel Postgres خوش آمدید",
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "خانه - شرکت بازرگانی مرصاد",
    description: "به پروژه Next.js + Prisma + Vercel Postgres خوش آمدید",
  },
};

export default function Home() {
  return (
    <div className="mx-auto px-4 py-8">
      {/* Main Slider Section */}
      <Slider />

      {/* Categories Section */}
      <CategoriesSection />
      <hr className="my-10" />

      {/* Best Selling Products Section */}
      <ProductSlider
        title="پرفروش‌ترین محصولات"
        apiEndpoint="/api/products/best-selling"
        queryParams={{ sort: "best-selling" }}
        description="محصولات محبوب و پرفروش ما"
        icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        }
      />
      <hr className="my-10" />
      {/* Articles Section */}
      <ArticlesSection />
      <hr className="my-10" />

      {/* Newest Products Section */}
      <ProductSlider
        title="جدیدترین محصولات"
        apiEndpoint="/api/products/newest"
        queryParams={{ sort: "newest" }}
        description="آخرین محصولات اضافه شده به فروشگاه"
        icon={
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
      <hr className="my-10" />
      {/* About Section */}
      <AboutSection />
    </div>
  );
}
