import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "سامانه ارائه دهنده",
  description: "سایت ساخته شده با Next.js و Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} font-vazirmatn antialiased`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
