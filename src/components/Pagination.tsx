import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col items-center mt-8">

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        {currentPage > 1 && (
          <Link href={createPageUrl(currentPage - 1)}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 text-sm border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              قبلی
            </Button>
          </Link>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="px-2 py-1 text-gray-400">
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <Link key={pageNumber} href={createPageUrl(pageNumber)}>
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`h-9 w-9 p-0 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                      : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {pageNumber}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages && (
          <Link href={createPageUrl(currentPage + 1)}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 text-sm border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              بعدی
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
