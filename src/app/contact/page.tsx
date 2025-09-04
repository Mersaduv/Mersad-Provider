"use client";

import { useState } from "react";
import { Metadata } from "next";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitStatus("success");
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setSubmitStatus("idle");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="contact-hero-bg relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="contact-hero-title text-4xl md:text-6xl font-bold mb-6">
              تماس با ما
            </h1>
            <p className="contact-hero-subtitle text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              ما اینجا هستیم تا به شما کمک کنیم. با ما در تماس باشید و سوالات خود را بپرسید
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>پاسخ سریع</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>پشتیبانی ۲۴/۷</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>مشاوره رایگان</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="contact-form-container">
            <div className="contact-form-header mb-8">
              <h2 className="contact-form-title text-3xl font-bold mb-4">
                پیام خود را ارسال کنید
              </h2>
              <p className="contact-form-subtitle text-gray-600 leading-relaxed">
                فرم زیر را پر کنید و ما در اسرع وقت با شما تماس خواهیم گرفت
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="contact-input-group">
                  <label htmlFor="name" className="contact-label">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="contact-input"
                    placeholder="نام کامل خود را وارد کنید"
                  />
                </div>

                <div className="contact-input-group">
                  <label htmlFor="email" className="contact-label">
                    ایمیل *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="contact-input"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="contact-input-group">
                  <label htmlFor="phone" className="contact-label">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="contact-input"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  />
                </div>

                <div className="contact-input-group">
                  <label htmlFor="subject" className="contact-label">
                    موضوع *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="contact-input"
                  >
                    <option value="">انتخاب موضوع</option>
                    <option value="general">سوال عمومی</option>
                    <option value="product">محصولات</option>
                    <option value="support">پشتیبانی فنی</option>
                    <option value="partnership">همکاری</option>
                    <option value="complaint">شکایت</option>
                    <option value="other">سایر</option>
                  </select>
                </div>
              </div>

              <div className="contact-input-group">
                <label htmlFor="message" className="contact-label">
                  پیام *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="contact-input"
                  placeholder="پیام خود را اینجا بنویسید..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="contact-submit-btn w-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال ارسال...</span>
                  </div>
                ) : (
                  "ارسال پیام"
                )}
              </button>

              {submitStatus === "success" && (
                <div className="contact-success-message">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>پیام شما با موفقیت ارسال شد!</span>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-container">
            <div className="contact-info-header mb-8">
              <h2 className="contact-info-title text-3xl font-bold mb-4">
                اطلاعات تماس
              </h2>
              <p className="contact-info-subtitle text-gray-600 leading-relaxed">
                از طریق روش‌های مختلف با ما در ارتباط باشید
              </p>
            </div>

            <div className="space-y-6">
              {/* Office Locations */}
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-card-title">آدرس دفاتر</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-orange-500 mb-1">دفتر هرات</h4>
                      <p className="text-gray-600 text-sm">
                        شهر نو مقابل خراسان مارکت<br />
                        دفتر کیمیاگر فارما
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-500 mb-1">دفتر کابل</h4>
                      <p className="text-gray-600 text-sm">
                        در حال راه‌اندازی
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-card-title">شماره تماس</h3>
                  <div className="space-y-2">
                    <a
                      href="tel:0702185538"
                      className="contact-phone-link"
                    >
                      <span className="font-mono">۰۷۰۲۱۸۵۵۳۸</span>
                      <span className="text-sm text-gray-500">(هرات)</span>
                    </a>
                    <a
                      href="tel:0702185538"
                      className="contact-phone-link"
                    >
                      <span className="font-mono">۰۷۰۲۱۸۵۵۳۸</span>
                      <span className="text-sm text-gray-500">(کابل)</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-card-title">ایمیل</h3>
                  <a
                    href="mailto:mersadkarimi0@gmail.com"
                    className="contact-email-link"
                  >
                    mersadkarimi0@gmail.com
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 4a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-card-title">شبکه‌های اجتماعی</h3>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <a
                      href="https://t.me/mersad_ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-link bg-sky-500 hover:bg-sky-600"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.12.54-.44.68-.89.42l-2.46-1.81-1.19 1.15c-.13.13-.24.24-.49.24l.18-2.56 4.57-4.12c.2-.18-.04-.28-.31-.1l-5.65 3.56-2.44-.76c-.53-.16-.54-.53.11-.79l9.57-3.69c.44-.16.83.1.69.79z" />
                      </svg>
                      <span>تلگرام</span>
                    </a>
                    <a
                      href="https://wa.me/93702185538"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-link bg-green-500 hover:bg-green-600"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                      <span>واتساپ</span>
                    </a>
                    <a
                      href="https://instagram.com/mersadmai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-link bg-purple-500 hover:bg-purple-600"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>اینستاگرام</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="contact-info-card-title">ساعات کاری</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>شنبه تا چهارشنبه: ۸:۰۰ - ۱۷:۰۰</p>
                    <p>پنج‌شنبه: ۸:۰۰ - ۱۲:۰۰</p>
                    <p>جمعه: تعطیل</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="contact-map-container">
            <h2 className="contact-map-title text-3xl font-bold text-center mb-8">
              موقعیت دفاتر ما
            </h2>
            <div className="contact-map-wrapper">
              <div className="contact-map-placeholder">
                <div className="contact-map-icon">
                  <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">نقشه در حال بارگذاری</h3>
                <p className="text-gray-600 mb-4">
                  نقشه تعاملی دفاتر ما به زودی در دسترس خواهد بود
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="contact-map-info">
                    <h4 className="font-semibold text-orange-500">دفتر هرات</h4>
                    <p className="text-sm text-gray-600">شهر نو مقابل خراسان مارکت</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
