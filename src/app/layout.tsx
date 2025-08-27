import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { Providers } from "@/components/Providers";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";
import { DynamicLayout } from "@/components/DynamicLayout";

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
    <html lang="fa" dir="rtl" className="scroll-smooth">
      <body
        className={`${vazirmatn.variable} font-vazirmatn antialiased`}
      >
        <Providers>
          <ScrollProgress />
          <Navigation />
          <DynamicLayout>
            {children}
          </DynamicLayout>
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
