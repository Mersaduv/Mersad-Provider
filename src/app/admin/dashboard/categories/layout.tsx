import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت دسته‌بندی‌ها - سامانه ارائه دهنده",
  description: "مدیریت و ویرایش دسته‌بندی‌های محصولات در پنل ادمین",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
