"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export function Navigation() {
  const phoneNumber = "+93702185538";

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // کپی شماره
    navigator.clipboard.writeText(phoneNumber).then(() => {
      console.log("شماره کپی شد:", phoneNumber);
    });

    // باز کردن شماره‌گیر
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-2xl">
            شرکت بازرگانی مرصاد
          </Link>

          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/products">
              <Button variant="ghost">محصولات</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost">درباره ما</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">تماس با ما</Button>
            </Link>
          </div>
          <div>
            <Link href="/admin/login">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
        <hr />
        <div className="flex items-center justify-between">
          <div>
            دسته بندی ها
          </div>
          <div className="flex items-center justify-center gap-2">
            <div>استعلام قیمت:</div>
            <button
              dir="ltr"
              onClick={handlePhoneClick}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              {phoneNumber}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
