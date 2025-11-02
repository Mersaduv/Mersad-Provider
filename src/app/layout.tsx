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
    default: "شرکت بازرگانی مرصاد",
    template: "%s | شرکت بازرگانی مرصاد",
  },
  description: "سایت ساخته شده با Next.js و Prisma - شرکت بازرگانی مرصاد محصولات و خدمات",
  keywords: ["Next.js", "Prisma", "فارسی", "محصولات", "فروشگاه"],
  authors: [{ name: "شرکت بازرگانی مرصاد" }],
  creator: "شرکت بازرگانی مرصاد",
  publisher: "شرکت بازرگانی مرصاد",
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
    siteName: "شرکت بازرگانی مرصاد",
    title: "شرکت بازرگانی مرصاد",
    description: "سایت ساخته شده با Next.js و Prisma - شرکت بازرگانی مرصاد محصولات و خدمات",
  },
  twitter: {
    card: "summary_large_image",
    title: "شرکت بازرگانی مرصاد",
    description: "سایت ساخته شده با Next.js و Prisma - شرکت بازرگانی مرصاد محصولات و خدمات",
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
