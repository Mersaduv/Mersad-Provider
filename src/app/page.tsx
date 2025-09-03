import Slider from "@/components/Slider";
import CategoriesSection from "@/components/CategoriesSection";
import ArticlesSection from "@/components/ArticlesSection";
import { Metadata } from "next";

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
    <div className="container mx-auto px-4 py-8">
      {/* Slider Section */}
      <Slider />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Articles Section */}
      <ArticlesSection />

    </div>
  );
}
