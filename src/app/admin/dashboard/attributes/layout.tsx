import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت ویژگی‌ها - سامانه ارائه دهنده",
  description: "مدیریت و ویرایش ویژگی‌های محصولات در پنل ادمین",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AttributesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
