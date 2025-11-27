import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { Providers } from "@/components/Providers";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollToTopOnRouteChange } from "@/components/ScrollToTopOnRouteChange";
import Footer from "@/components/Footer";
import "./globals.css";
import { DynamicLayout } from "@/components/DynamicLayout";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: {
    default: "شرکت مرصاد لمیتد",
    template: "%s | شرکت مرصاد لمیتد",
  },
  description: "سایت ساخته شده با Next.js و Prisma - شرکت مرصاد لمیتد محصولات و خدمات",
  keywords: ["Next.js", "Prisma", "فارسی", "محصولات", "فروشگاه"],
  authors: [{ name: "شرکت مرصاد لمیتد" }],
  creator: "شرکت مرصاد لمیتد",
  publisher: "شرکت مرصاد لمیتد",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "/",
    siteName: "شرکت مرصاد لمیتد",
    title: "شرکت مرصاد لمیتد",
    description: "سایت ساخته شده با Next.js و Prisma - شرکت مرصاد لمیتد محصولات و خدمات",
  },
  twitter: {
    card: "summary_large_image",
    title: "شرکت مرصاد لمیتد",
    description: "سایت ساخته شده با Next.js و Prisma - شرکت مرصاد لمیتد محصولات و خدمات",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
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
          <ScrollToTopOnRouteChange />
          <Navigation />
          <DynamicLayout>
            {children}
          </DynamicLayout>
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
