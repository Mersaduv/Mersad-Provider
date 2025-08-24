import Link from "next/link";
import { Button } from "./ui/button";

export function Navigation() {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            سامانه ارائه دهنده
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
        </div>
      </div>
    </nav>
  );
}
