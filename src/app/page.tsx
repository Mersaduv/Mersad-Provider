import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-4xl font-bold mb-6">به پروژه Next.js + Prisma + Vercel Postgres خوش آمدید</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8">
          این یک پروژه نمونه با پشتیبانی از زبان فارسی و چینش راست به چپ است که با استفاده از Next.js، Prisma و Vercel Postgres ساخته شده است.
        </p>
        
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link href="/products">
            <Button size="lg">مشاهده محصولات</Button>
          </Link>
          <a href="https://github.com/your-username/your-repo" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">مشاهده کد منبع</Button>
          </a>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border rounded-lg p-6 shadow-sm">
          <div className="mb-4 text-3xl">🚀</div>
          <h3 className="text-xl font-bold mb-2">Next.js App Router</h3>
          <p className="text-gray-600">
            استفاده از آخرین ویژگی‌های Next.js با معماری جدید App Router، Server Components و استفاده از API Routes.
          </p>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm">
          <div className="mb-4 text-3xl">🔍</div>
          <h3 className="text-xl font-bold mb-2">Prisma ORM</h3>
          <p className="text-gray-600">
            استفاده از Prisma به عنوان ORM برای دسترسی آسان و تایپ‌سیف به دیتابیس با مدل‌های از پیش تعریف شده.
          </p>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm">
          <div className="mb-4 text-3xl">💾</div>
          <h3 className="text-xl font-bold mb-2">Vercel Postgres</h3>
          <p className="text-gray-600">
            استفاده از Vercel Postgres به عنوان دیتابیس ابری با قابلیت مقیاس‌پذیری و امنیت بالا.
          </p>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">شروع به کار</h2>
        <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg text-right">
          <p className="font-semibold mb-2">برای راه‌اندازی پروژه:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>فایل <code className="bg-gray-200 px-1 py-0.5 rounded">.env</code> را با اطلاعات دیتابیس خود پیکربندی کنید</li>
            <li>دستور <code className="bg-gray-200 px-1 py-0.5 rounded">npx prisma migrate dev</code> را اجرا کنید</li>
            <li>با دستور <code className="bg-gray-200 px-1 py-0.5 rounded">npm run dev</code> سرور توسعه را راه‌اندازی کنید</li>
            <li>در مرورگر به آدرس <code className="bg-gray-200 px-1 py-0.5 rounded">http://localhost:3000</code> مراجعه کنید</li>
          </ol>
        </div>
      </div>
    </div>
  );
}