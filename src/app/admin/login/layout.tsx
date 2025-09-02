import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود ادمین - سامانه ارائه دهنده",
  description: "صفحه ورود ادمین برای دسترسی به پنل مدیریت",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
