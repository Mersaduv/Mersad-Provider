import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت محصولات - سامانه ارائه دهنده",
  description: "مدیریت و ویرایش محصولات در پنل ادمین",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
