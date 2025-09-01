"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { phoneNumber } from "@/lib/utils";

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

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Use the custom hook
  useNavigationHeight();

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out nav-height-transition ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-auto">
          <Link
            href="/"
            className={`font-bold flex items-center gap-2 text-2xl text-gray-800 hover:text-blue-600 transition-all duration-300 ${
              isScrolled ? "scale-105" : "scale-100"
            }`}
          >
            <div className="py-2">
              <img src="/images/logo.png" alt="logo" className="w-16 h-16" />
            </div>
            <h1> شرکت بازرگانی مرصاد</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Link href="/products">
              <Button
                variant="ghost"
                className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                محصولات
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="ghost"
                className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                درباره ما
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="ghost"
                className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                تماس با ما
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Link href="/admin/login">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                Admin Login
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 ${
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
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <hr className="border-gray-200" />
          <div className="py-4 space-y-2">
            <Link href="/products">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                محصولات
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                درباره ما
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                تماس با ما
              </Button>
            </Link>
          </div>
        </div>

        {/* Second Section with smooth animation */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isSecondSectionVisible
              ? "max-h-20 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <hr className="border-gray-200" />
          <div className="flex items-center justify-between py-2">
            <div className="text-gray-700 font-medium">
              {/* Search Section  */} search
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-gray-600">استعلام قیمت:</div>
              <button
                dir="ltr"
                onClick={handlePhoneClick}
                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors font-medium"
              >
                {phoneNumber}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
