import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import Link from 'next/link'

interface Article {
  id: string;
  title: string;
  description: string;
  slug: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const metadata: Metadata = {
  title: 'مقالات و راهنماها - شرکت بازرگانی مرصاد',
  description: 'مجموعه مقالات و راهنماهای مفید برای شما',
  openGraph: {
    title: 'مقالات و راهنماها - شرکت بازرگانی مرصاد',
    description: 'مجموعه مقالات و راهنماهای مفید برای شما',
    type: 'website',
    locale: 'fa_IR',
  },
}

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { isActive: true },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              مقالات و راهنماها
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              مجموعه مقالات و راهنماهای مفید برای شما
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                هنوز مقاله‌ای منتشر نشده است
              </h2>
              <p className="text-gray-600">
                به زودی مقالات مفیدی برای شما منتشر خواهیم کرد
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    
                    <div 
                      className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4"
                      dangerouslySetInnerHTML={{ 
                        __html: article.description.length > 200 
                          ? article.description.substring(0, 200) + '...' 
                          : article.description 
                      }}
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                      
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                        <span>ادامه مطلب</span>
                        <div className="rotate-180 mr-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-16">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <div className="rotate-180 ml-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
