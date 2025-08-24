import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export function ProductCard({ id, name, description, price, imageUrl }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            تصویر موجود نیست
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <p className="font-bold">
            {new Intl.NumberFormat('fa-IR').format(price)} تومان
          </p>
          <Link href={`/products/${id}`}>
            <Button size="sm">مشاهده</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
