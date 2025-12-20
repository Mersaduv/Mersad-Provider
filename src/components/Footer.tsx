"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-gradient text-white footer-fade-in">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="footer-section-title text-xl font-bold mb-4 text-white pb-2 inline-block">
                شرکت مرصاد لمیتد
              </h3>
              <p className="footer-company-text text-gray-200 leading-relaxed text-sm">
                از سال 1400 فعالیت خود را آغاز کرده و با تکیه بر تجربه و تخصص،
                به یکی از پیشروان صنعت لمیتد تبدیل شده‌ایم. هدف ما ارائه
                بهترین خدمات و محصولات با کیفیت به مشتریان است.{" "}
              </p>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="lg:col-span-1">
            <h3 className="footer-section-title text-xl font-bold mb-4 text-white pb-2 inline-block">
              تماس با شرکت مرصاد لمیتد
            </h3>

            {/* Herat Office */}
            <div className="mb-6">
              <div className="footer-contact-item flex items-start gap-2 mb-3">
                <div className="footer-contact-icon w-4 h-4 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                <h4 className="font-semibold text-orange-300">دفتر هرات</h4>
              </div>
              <div className="mr-6 space-y-2">
                <p className="text-gray-200 text-sm">
                  هرات,جاده عیدگاه دفتر کیمیاگر فارما
                </p>
                <div className="footer-contact-item flex items-center gap-2">
                  <div className="footer-contact-icon w-4 h-4 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <a
                    href="tel:0702185538"
                    className="text-gray-200 hover:text-orange-300 transition-colors text-lg underline"
                  >
                    0702185538
                  </a>
                </div>
              </div>
            </div>

             {/* Kabul Office */}
             <div className="mb-6">
              <div className="footer-contact-item flex items-start gap-2 mb-3">
                <div className="footer-contact-icon w-4 h-4 bg-red-500 rounded-full flex-shrink-0 mt-1"></div>
                <h4 className="font-semibold text-orange-300">دفتر کابل</h4>
              </div>
              <div className="mr-6 space-y-2">
                {/* <p className="text-gray-200 text-sm">
                 .
                </p> */}
                {/* <div className="footer-contact-item flex items-center gap-2">
                  <div className="footer-contact-icon w-4 h-4 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <a
                    href="tel:0564710400"
                    className="text-gray-200 hover:text-orange-300 transition-colors text-lg underline"
                  >
                    ۰۵۶۴۷۱۰۴۰۰
                  </a>
                </div> */}
                <div className="footer-contact-item flex items-center gap-2">
                  <div className="footer-contact-icon w-4 h-4 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <a
                    href="tel:0702185538"
                    className="text-gray-200 hover:text-orange-300 transition-colors text-lg underline"
                  >
                    ۰۷۰۲۱۸۵۵۳۸
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="footer-contact-item flex items-center gap-2">
              <div className="footer-contact-icon w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
              <a
                href="mailto:mersadkarimi001@gmail.com"
                className="text-gray-200 hover:text-orange-300 transition-colors text-lg underline"
              >
                mersadkarimi001@gmail.com
              </a>
            </div>
          </div>

          {/* Important Links Section */}
          <div className="lg:col-span-1">
            <h3 className="footer-section-title text-xl font-bold mb-4 text-white pb-2 inline-block">
              لینک‌های مهم
            </h3>
            <nav className="space-y-3">
              <Link
                href="/contact"
                className="footer-link block text-gray-200 hover:text-orange-300 transition-colors text-sm hover:translate-x-1 transform duration-200"
              >
                تماس با ما
              </Link>
              <Link
                href="/about"
                className="footer-link block text-gray-200 hover:text-orange-300 transition-colors text-sm hover:translate-x-1 transform duration-200"
              >
                درباره شرکت مرصاد لمیتد
              </Link>
              <Link
                href="/articles"
                className="footer-link block text-gray-200 hover:text-orange-300 transition-colors text-sm hover:translate-x-1 transform duration-200"
              >
                مقالات
              </Link>
            </nav>
          </div>

          {/* Social Media Section */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Social Media Icons */}
              <div className="space-y-3">
                <a
                  href="https://t.me/mersadltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon flex items-center gap-3 p-3 bg-sky-500 hover:bg-sky-600 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.12.54-.44.68-.89.42l-2.46-1.81-1.19 1.15c-.13.13-.24.24-.49.24l.18-2.56 4.57-4.12c.2-.18-.04-.28-.31-.1l-5.65 3.56-2.44-.76c-.53-.16-.54-.53.11-.79l9.57-3.69c.44-.16.83.1.69.79z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium text-sm group-hover:text-white">
                    تلگرام 
                  </span>
                </a>

                <a
                  href="https://wa.me/93702185538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon flex items-center gap-3 p-3 bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                  </div>
                  <span className="text-white font-medium text-sm group-hover:text-white">
                    واتساپ
                  </span>
                </a>

                <a
                  href="https://instagram.com/mersad.ltd"
                  target="_blank"   
                  rel="noopener noreferrer"
                  className="footer-social-icon flex items-center gap-3 p-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <span className="text-white font-medium text-sm group-hover:text-white">
                    اینستاگرام
                  </span>
                </a>
              </div>

              {/* Brand Name */}
              <div className="pt-4 border-t border-gray-600">
                <p className="text-gray-300 text-sm font-medium">
                  mersad ltd
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="footer-bottom-text text-gray-300 text-sm text-center md:text-right">
              © {new Date().getFullYear()} شرکت مرصاد لمیتد. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="footer-bottom-text">
                طراحی و توسعه: Mersad Karimi
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
