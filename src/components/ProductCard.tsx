import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrls: string[];
  categoryName: string;
}

export function ProductCard({
  id,
  slug,
  name,
  description,
  imageUrls,
  categoryName,
}: ProductCardProps) {
  const imageUrl = imageUrls && imageUrls.length > 0 ? imageUrls[0] : undefined;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 group">
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 w-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            تصویر موجود نیست
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="inline-block bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs font-medium">
            {categoryName}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
          {name}
        </h3>
        <div className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed max-h-16 overflow-hidden">
          <div
            className="text-gray-700 leading-relaxed prose prose-lg max-w-none ck-content"
            dangerouslySetInnerHTML={{ __html: description }}
          /> ...
        </div>
        <div className="flex justify-between items-center">
          <Link href={`/products/${slug}`}>
            <Button
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium"
            >
              مشاهده جزئیات
            </Button>
          </Link>
          <div className="text-xs text-gray-400">
            {imageUrls?.length || 0} تصویر
          </div>
        </div>
      </div>
    </div>
  );
}
