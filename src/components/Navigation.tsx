"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { phoneNumber } from "@/lib/utils";
import { SearchAutocomplete } from "./SearchAutocomplete";
import { useSession, signIn } from "next-auth/react";
import { useOrderModal } from "@/contexts/OrderModalContext";
import { useRouter, usePathname } from "next/navigation";

// Custom hook to track navigation height changes
function useNavigationHeight() {
  const [navHeight, setNavHeight] = useState(144); // Default height

  useEffect(() => {
    const updateHeight = () => {
      const navElement = document.querySelector("nav");
      if (navElement) {
        const height = navElement.offsetHeight;
        setNavHeight(height);

        // Emit custom event for layout to listen to
        window.dispatchEvent(
          new CustomEvent("navigationHeightChange", {
            detail: { height },
          })
        );
      }
    };

    // Update height after transitions
    const timer = setTimeout(updateHeight, 100);

    // Listen for scroll events to update height
    const handleScroll = () => {
      setTimeout(updateHeight, 300); // Wait for transition to complete
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return navHeight;
}

// Category type definition
interface Category {
  id: string;
  name: string;
  slug: string;
  level: number;
  isActive: boolean;
  parentId?: string;
  children?: Category[];
  parent?: Category;
}

// Component to render category tree
function CategoryTreeItem({
  category,
  onCategoryClick,
  level = 0,
  isMobile = false,
  expandedCategories,
  onToggleExpansion,
  onCategoryHover,
}: {
  category: Category;
  onCategoryClick: (categorySlug: string) => void;
  level?: number;
  isMobile?: boolean;
  expandedCategories: Set<string>;
  onToggleExpansion: (categoryId: string) => void;
  onCategoryHover: (categoryId: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpansion(category.id);
    }
  };

  const handleCategoryClickWithToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile && hasChildren) {
      // در mobile mode، اگر فرزند دارد، فقط toggle کن
      onToggleExpansion(category.id);
    } else {
      // در غیر این صورت، به صفحه محصولات برو
      onCategoryClick(category.slug);
    }
  };

  const handleCategoryNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // همیشه به صفحه محصولات برو
    onCategoryClick(category.slug);
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
      // فقط اگر فرزند دارد، ساختار درختی را باز کن
      if (hasChildren) {
        onCategoryHover(category.id);
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      // دیگر زیردسته‌ها را با unhover ببند نکن
      // فقط hover state را تغییر بده
    }
  };

  return (
    <div
      className="w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm ${
          isHovered ? "bg-indigo-50 text-indigo-600" : ""
        }`}
        style={{ paddingRight: `${level * 20 + 16}px` }}
      >
        {isMobile ? (
          // Mobile layout: Plus button + Category name + Blue arrow
          <div className="flex items-center gap-3 flex-1">
            {/* Plus button for expanding children */}
            <div className="w-4 h-4 flex items-center justify-center">
              {hasChildren ? (
                <button
                  onClick={handleToggle}
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <svg
                    className={`w-6 h-6 transition-transform duration-200 ${
                      isExpanded ? "rotate-45" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              ) : (
                <div className="w-3 h-3"></div>
              )}
            </div>

            {/* Category name - clickable */}
            <span
              className="flex-1 text-right font-medium cursor-pointer"
              onClick={handleCategoryNameClick}
            >
              {category.name}
            </span>

            {/* Blue arrow for navigation */}
            <div className="w-6 h-6 flex items-center justify-center rotate-180">
              <svg
                className="w-6 h-6 text-blue-500"
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
        ) : (
          // Desktop layout: Original design
          <div
            className="flex items-center gap-3 flex-1 cursor-pointer"
            onClick={handleCategoryClickWithToggle}
          >
            {/* Arrow icon for all items */}
            <div className="w-4 h-4 flex items-center justify-center">
              {hasChildren ? (
                <button
                  onClick={handleToggle}
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isExpanded ? "rotate-90" : ""
                    } ${isHovered ? "text-indigo-600" : ""}`}
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
                </button>
              ) : (
                <svg
                  className="w-3 h-3 text-gray-400"
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
              )}
            </div>

            <span className="flex-1 text-right font-medium">
              {category.name}
            </span>
          </div>
        )}
      </div>

      {/* نمایش ساختار درختی برای دسته‌بندی‌هایی که فرزند دارند */}
      {hasChildren && isExpanded && (
        <div className="w-full">
          {category.children!.map((child: Category) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              onCategoryClick={onCategoryClick}
              level={level + 1}
              isMobile={isMobile}
              expandedCategories={expandedCategories}
              onToggleExpansion={onToggleExpansion}
              onCategoryHover={onCategoryHover}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Component to render tree-style category dropdown for desktop
function TreeCategoryDropdown({
  categories,
  onCategoryClick,
  isLoading,
  expandedCategories,
  onToggleExpansion,
  onCategoryHover,
}: {
  categories: Category[];
  onCategoryClick: (categorySlug: string) => void;
  isLoading: boolean;
  expandedCategories: Set<string>;
  onToggleExpansion: (categoryId: string) => void;
  onCategoryHover: (categoryId: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        <div className="text-sm">در حال بارگذاری...</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        <div className="text-sm">دسته بندی‌ای یافت نشد</div>
      </div>
    );
  }

  return (
    <div className="py-2">
      {categories.map((category) => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          onCategoryClick={onCategoryClick}
          level={0}
          isMobile={false}
          expandedCategories={expandedCategories}
          onToggleExpansion={onToggleExpansion}
          onCategoryHover={onCategoryHover}
        />
      ))}
    </div>
  );
}

// Function to build category tree
function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  // First pass: create a map of all categories
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Second pass: build the tree structure
  categories.forEach((category) => {
    const categoryWithChildren = categoryMap.get(category.id)!;

    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children!.push(categoryWithChildren);
      }
    } else {
      rootCategories.push(categoryWithChildren);
    }
  });

  return rootCategories;
}

export function Navigation() {
  const { data: session } = useSession();
  const { isModalOpen } = useOrderModal();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
    useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [phoneNumberLogin, setPhoneNumberLogin] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Use the custom hook
  useNavigationHeight();

  // Close mobile menu and reset scroll when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileCategoriesOpen(false);
    setExpandedCategories(new Set());
    
    // Reset scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [pathname]);

  // Listen for custom event to close mobile menu
  useEffect(() => {
    const handleCloseMobileMenu = () => {
      setIsMobileMenuOpen(false);
      setIsMobileCategoriesOpen(false);
      setExpandedCategories(new Set());
    };

    window.addEventListener("closeMobileMenu", handleCloseMobileMenu);
    return () => {
      window.removeEventListener("closeMobileMenu", handleCloseMobileMenu);
    };
  }, []);

  // Fetch categories when dropdown is opened
  useEffect(() => {
    if (
      (isCategoriesDropdownOpen || isMobileCategoriesOpen) &&
      categories.length === 0
    ) {
      fetchCategories();
    }
  }, [isCategoriesDropdownOpen, isMobileCategoriesOpen, categories.length]);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        // Filter only active categories
        const activeCategories = data.filter((cat: Category) => cat.isActive);
        setCategories(activeCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollThreshold = 100; // آستانه اسکرول برای نمایش/مخفی کردن بخش دوم

      setIsScrolled(scrollTop > 50);

      if (scrollTop > scrollThreshold) {
        setIsSecondSectionVisible(false);
      } else {
        setIsSecondSectionVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".categories-dropdown")) {
        setIsCategoriesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();

    navigator.clipboard.writeText(phoneNumber).then(() => {
      console.log("شماره کپی شد:", phoneNumber);
    });

    window.location.href = `tel:${phoneNumber}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCategoriesDropdown = () => {
    const newState = !isCategoriesDropdownOpen;
    setIsCategoriesDropdownOpen(newState);
    // Clear expanded categories when closing dropdown
    if (!newState) {
      setExpandedCategories(new Set());
    }
  };

  const toggleMobileCategories = () => {
    setIsMobileCategoriesOpen(!isMobileCategoriesOpen);
  };

  const handleCategoryClick = (categorySlug: string) => {
    setIsCategoriesDropdownOpen(false);
    setIsMobileCategoriesOpen(false);
    // Clear expanded categories when navigating
    setExpandedCategories(new Set());
    // Navigate to products page with category filter using Next.js router
    router.push(`/products?category=${categorySlug}`);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategoryHover = (categoryId: string) => {
    setExpandedCategories((prev) => new Set(prev).add(categoryId));
  };

  // Build category tree
  const categoryTree = buildCategoryTree(categories);

  // Handle phone login
  const handlePhoneLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await signIn("phone", {
        phone: phoneNumberLogin,
        redirect: false,
      });

      if (result?.ok) {
        setShowLoginModal(false);
        setPhoneNumberLogin("");
        // Navigate to profile using Next.js router
        router.push("/profile");
      } else {
        alert("شماره تلفن اشتباه است یا سفارشی ثبت نکرده‌اید");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("خطا در ورود. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle order button click
  const handleOrderClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out nav-height-transition ${
        isModalOpen ? "z-[0]" : "z-[999]"
      } ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-white shadow-sm"
      }`}
    >
      <div className=" mx-auto px-4">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-auto">
          <div className="flex items-center">
            <Link
              href="/"
              prefetch={true}
              className={`font-bold flex items-center gap-2 text-2xl text-gray-800 hover:text-indigo-600 transition-all duration-300 ${
                isScrolled ? "scale-105" : "scale-100"
              }`}
            >
              <div className="py-2">
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
              <h1>شرکت مرصاد لمیتد</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
              <Link href="/products" prefetch={true}>
                <Button
                  variant="ghost"
                  className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  محصولات
                </Button>
              </Link>

              {/* Categories Dropdown */}
              <div className="relative categories-dropdown">
                <Button
                  variant="ghost"
                  className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-1"
                  onClick={toggleCategoriesDropdown}
                >
                  دسته بندی
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCategoriesDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>

                {/* Tree-style Dropdown Menu */}
                {isCategoriesDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-80 max-w-md overflow-hidden">
                    <TreeCategoryDropdown
                      categories={categoryTree}
                      onCategoryClick={handleCategoryClick}
                      isLoading={isLoadingCategories}
                      expandedCategories={expandedCategories}
                      onToggleExpansion={toggleCategoryExpansion}
                      onCategoryHover={handleCategoryHover}
                    />
                  </div>
                )}
              </div>

              <Link href="/about" prefetch={true}>
                <Button
                  variant="ghost"
                  className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  درباره ما
                </Button>
              </Link>
              <Link href="/contact" prefetch={true}>
                <Button
                  variant="ghost"
                  className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  تماس با ما
                </Button>
              </Link>
              {session ? (
                <Link href="/profile" prefetch={true}>
                  <Button className="bg-gradient-to-r whitespace-nowrap from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    سفارش های من
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleOrderClick}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  سفارش های من
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Desktop User Button - only visible above mdx */}
            <Link href="/admin/login" className="hidden lg:block">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
              >
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-sm font-medium">ورود</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-90" : "rotate-0"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <hr className="border-gray-200" />
          <div className="py-4">
            <Link href="/products" prefetch={true}>
              <Button
                variant="ghost"
                className="w-full text-start hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                محصولات
              </Button>
            </Link>

            {/* Mobile Categories Section */}
            <div className="">
              <button
                onClick={toggleMobileCategories}
                className="w-full rounded-md py-2 px-4 flex items-center justify-between text font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <span>دسته بندی‌ها</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileCategoriesOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isMobileCategoriesOpen && (
                <div className="mt-2">
                  {isLoadingCategories ? (
                    <div className="text-sm text-gray-500">
                      در حال بارگذاری...
                    </div>
                  ) : categoryTree.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      دسته بندی‌ای یافت نشد
                    </div>
                  ) : (
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {categoryTree.map((category) => (
                        <CategoryTreeItem
                          key={category.id}
                          category={category}
                          onCategoryClick={handleCategoryClick}
                          isMobile={true}
                          expandedCategories={expandedCategories}
                          onToggleExpansion={toggleCategoryExpansion}
                          onCategoryHover={handleCategoryHover}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link href="/about" prefetch={true}>
              <Button
                variant="ghost"
                className="w-full text-start hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                درباره ما
              </Button>
            </Link>
            <Link href="/contact" prefetch={true}>
              <Button
                variant="ghost"
                className="w-full text-start hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                تماس با ما
              </Button>
            </Link>
            {session ? (
              <Link href="/profile" prefetch={true} className="w-full">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  سفارش های من
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleOrderClick}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                سفارش های من
              </Button>
            )}

            {/* Mobile User Button */}
            <Link href="/admin/login">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium">ورود</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Second Section with smooth animation */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isSecondSectionVisible
              ? "max-h-28 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <hr className="border-gray-200" />
          <div className="flex items-center justify-between py-2 px-1 flex-col lg:flex-row gap-4">
            <div className="flex-1 max-w-md w-full">
              <SearchAutocomplete />
            </div>
            <div className="flex justify-between items-center gap-2">
              <div className="lg:hidden">
              {session ? (
                <Link href="/profile" prefetch={true} className="w-full">
                  <Button className="w-full whitespace-nowrap bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    سفارش من
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleOrderClick}
                  className="w-full whitespace-nowrap bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  سفارش من
                </Button>
              )}
              </div>
             
              <div className="flex items-center justify-center gap-2 text-center">
                <div className="text-gray-600 text-sm lg:text-base">
                  استعلام:
                </div>
                <button
                  dir="ltr"
                  onClick={handlePhoneClick}
                  className="text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer transition-colors font-medium text-sm lg:text-base"
                >
                  {phoneNumber}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">ورود با شماره تلفن</h2>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setPhoneNumberLogin("");
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-indigo-100 mt-2 text-sm">
                لطفاً شماره تلفن خود را وارد کنید
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePhoneLogin();
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="phone-login"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  شماره تماس
                </label>
                <input
                  type="tel"
                  id="phone-login"
                  value={phoneNumberLogin}
                  onChange={(e) => setPhoneNumberLogin(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                  placeholder="شماره تلفن همراه..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  ایران (09xxxxxxxxx) یا افغانستان (07xxxxxxxx)
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowLoginModal(false);
                    setPhoneNumberLogin("");
                  }}
                  className="flex-1"
                  disabled={isLoggingIn}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-white">در حال ورود...</span>
                    </div>
                  ) : (
                    "ورود"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
