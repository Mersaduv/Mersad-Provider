"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
// import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrls: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface SearchAutocompleteProps {
  className?: string;
}

export function SearchAutocomplete({
  className = "",
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Update dropdown position when results change
  useEffect(() => {
    if (showDropdown) {
      updateDropdownPosition();
    }
  }, [showDropdown, results]);

  // Update dropdown position on scroll and resize
  useEffect(() => {
    if (showDropdown) {
      const handleScroll = () => updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [showDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is on dropdown or search input
      if (
        searchRef.current &&
        !searchRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowDropdown(data.length > 0);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown && e.key !== "Enter") return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleProductSelect(results[selectedIndex]);
        } else if (query.trim()) {
          // Navigate to products page with search query
          router.push(`/products?search=${encodeURIComponent(query.trim())}`);
          setShowDropdown(false);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleProductSelect = (product: SearchProduct) => {
    // Close dropdown and clear query
    setQuery("");
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    // Navigate to product page using Next.js router for client-side navigation
    router.push(`/products/${product.slug}`);
  };

  const updateDropdownPosition = () => {
    if (searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    updateDropdownPosition();
    if (results.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      if (!isFocused) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const highlightTextHTML = (text: string, query: string): string => {
    if (!query.trim()) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    
    return text.replace(regex, '<span class="bg-yellow-200 font-semibold">$1</span>');
  };

  return (
    <>
      <div ref={searchRef} className={`relative ${className}`}>
        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="جستجو..."
            className="w-full px-4 py-2 pr-12 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
            dir="rtl"
          />

          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>

          {/* Clear Button */}
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setShowDropdown(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Results - Rendered outside the search container */}
      {showDropdown &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto md:max-h-80"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
            }}
          >
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  در حال جستجو...
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                <div className="mb-2">محصولی یافت نشد</div>
                <div className="text-xs text-gray-400">
                  کلمات کلیدی دیگری امتحان کنید
                </div>
              </div>
            ) : (
              <div className="py-2">
                {results.map((product, index) => (
                  <div
                    key={product.id}
                    className={`px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? "bg-indigo-50 border-r-2 border-indigo-500"
                        : "hover:bg-gray-50"
                    }`}
                                         onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       handleProductSelect(product);
                     }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {product.imageUrls && product.imageUrls.length > 0 ? (
                          <Image
                            src={product.imageUrls[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {highlightText(product.name, query)}
                        </div>
                        <div className="text-xs text-gray-500 mb-1 hidden md:block">
                          {product.category.name}
                        </div>
                                                 <div 
                           className="text-xs text-gray-400 line-clamp-2 hidden md:block"
                           dangerouslySetInnerHTML={{ 
                             __html: highlightTextHTML(
                               product.description.substring(0, 100),
                               query
                             ) + (product.description.length > 100 ? "..." : "")
                           }}
                         />
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex-shrink-0 text-gray-400 rotate-180">
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
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
