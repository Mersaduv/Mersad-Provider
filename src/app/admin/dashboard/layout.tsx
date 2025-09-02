import { Metadata } from "next";

export const metadata: Metadata = {
  title: "داشبورد ادمین - سامانه ارائه دهنده",
  description: "پنل مدیریت ادمین برای مدیریت دسته‌بندی‌ها، ویژگی‌ها و محصولات",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
