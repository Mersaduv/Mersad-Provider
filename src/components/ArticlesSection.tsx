"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles?isActive=true");
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 articles-section-bg">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-10 bg-white/20 rounded w-64 mx-auto mb-6 backdrop-blur-sm"></div>
              <div className="h-6 bg-white/20 rounded w-96 mx-auto backdrop-blur-sm"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="article-card-premium rounded-lg p-6 floating-element">
                <div className="h-6 bg-white/30 rounded w-3/4 mb-4 animate-pulse backdrop-blur-sm"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/30 rounded w-full animate-pulse backdrop-blur-sm"></div>
                  <div className="h-4 bg-white/30 rounded w-5/6 animate-pulse backdrop-blur-sm"></div>
                  <div className="h-4 bg-white/30 rounded w-4/6 animate-pulse backdrop-blur-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 articles-section-bg">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title-premium text-4xl md:text-5xl mb-4">
            مقالات و جزئیات درباره محصولات
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            آخرین جزئیات و مقالات تخصصی در زمینه محصولات ما
          </p>
        </div>

        <div className="space-y-12">
          {/* Featured Articles (order = 0) */}
          {articles.filter(article => article.order === 0).map((article) => (
            <div
              key={article.id}
              className="featured-article-card rounded-2xl overflow-hidden floating-element"
            >
              <div className="p-8 md:p-12">
                <h2 className="article-title-premium text-3xl md:text-4xl mb-8 leading-tight">
                  {article.title}
                </h2>
                
                <div 
                  className="text-gray-700 text-lg leading-relaxed mb-8 prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.description }}
                />
              </div>
            </div>
          ))}

          {/* Regular Articles (order > 0) */}
          {articles.filter(article => article.order > 0).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.filter(article => article.order > 0).map((article, index) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group article-card-premium rounded-2xl overflow-hidden floating-element"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6">
                    <h3 className="article-title-premium text-xl mb-4 line-clamp-2 group-hover:scale-105 transition-transform duration-300">
                      {article.title}
                    </h3>
                    
                    <div 
                      className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-6"
                      dangerouslySetInnerHTML={{ 
                        __html: article.description.length > 150 
                          ? article.description.substring(0, 150) + '...' 
                          : article.description 
                      }}
                    />
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/30">
                      <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full">
                        {new Date(article.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                      
                      <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                        <span>ادامه مطلب</span>
                        <div className="rotate-180 mr-1 group-hover:translate-x-1 transition-transform">
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
        </div>

        {articles.filter(article => article.order > 0).length > 6 && (
          <div className="text-center mt-16">
            <Link
              href="/articles"
              className="btn-premium inline-flex items-center px-10 py-4 text-white font-semibold rounded-full text-lg"
            >
              مشاهده همه مقالات
              <div className="rotate-180 mr-3">
                <svg
                  className="w-5 h-5"
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
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
