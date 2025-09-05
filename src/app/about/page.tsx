import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "درباره ما - شرکت بازرگانی مرصاد",
  description:
    "شرکت بازرگانی مرصاد با سال‌ها تجربه در زمینه تجارت و بازرگانی، ارائه‌دهنده بهترین خدمات و محصولات با کیفیت به مشتریان خود است",
  keywords: ["درباره ما", "شرکت بازرگانی مرصاد", "تجارت", "بازرگانی", "کیفیت"],
  openGraph: {
    title: "درباره ما - شرکت بازرگانی مرصاد",
    description: "شرکت بازرگانی مرصاد با سال‌ها تجربه در زمینه تجارت و بازرگانی",
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary_large_image",
    title: "درباره ما - شرکت بازرگانی مرصاد",
    description: "شرکت بازرگانی مرصاد با سال‌ها تجربه در زمینه تجارت و بازرگانی",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto">
      <section className="about-section-bg py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h1 className="about-section-title text-4xl md:text-5xl mb-6">
              درباره ما
            </h1>
            <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
              شرکت بازرگانی مرصاد با سال‌ها تجربه در زمینه تجارت و بازرگانی،
              ارائه‌دهنده بهترین خدمات و محصولات با کیفیت به مشتریان خود است
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Content Side */}
            <div className="space-y-8">
              {/* Company Story */}
              <div className="about-card-premium p-8 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="about-icon-wrapper p-3 rounded-full ml-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h2 className="about-card-title text-2xl font-bold">
                    داستان ما
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  از سال 1400 فعالیت خود را آغاز کرده و با تکیه بر تجربه و تخصص،
                  به یکی از پیشروان صنعت بازرگانی تبدیل شده‌ایم. هدف ما ارائه
                  بهترین خدمات و محصولات با کیفیت به مشتریان است.
                </p>
              </div>

              {/* Mission */}
              <div className="about-card-premium p-8 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="about-icon-wrapper p-3 rounded-full ml-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="about-card-title text-2xl font-bold">
                    ماموریت ما
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  ایجاد ارتباطات تجاری پایدار و ارائه راه‌حل‌های نوآورانه برای
                  نیازهای مشتریان. ما متعهد به کیفیت، شفافیت و رضایت مشتری در
                  تمامی مراحل همکاری هستیم.
                </p>
              </div>

              {/* Values */}
              <div className="about-card-premium p-8 rounded-2xl">
                <div className="flex items-center mb-6">
                  <div className="about-icon-wrapper p-3 rounded-full ml-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="about-card-title text-2xl font-bold">
                    ارزش‌های ما
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="about-value-dot w-3 h-3 rounded-full ml-3"></div>
                    <span className="text-gray-700">کیفیت برتر</span>
                  </div>
                  <div className="flex items-center">
                    <div className="about-value-dot w-3 h-3 rounded-full ml-3"></div>
                    <span className="text-gray-700">اعتماد و شفافیت</span>
                  </div>
                  <div className="flex items-center">
                    <div className="about-value-dot w-3 h-3 rounded-full ml-3"></div>
                    <span className="text-gray-700">نوآوری و خلاقیت</span>
                  </div>
                  <div className="flex items-center">
                    <div className="about-value-dot w-3 h-3 rounded-full ml-3"></div>
                    <span className="text-gray-700">رضایت مشتری</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative">
              {/* Main Image Container */}
              <div className="about-image-container relative">
                <div className="rounded-3xl overflow-hidden">
                  <Image
                    src="/images/logo.png"
                    alt="شرکت بازرگانی مرصاد"
                    width={600}
                    height={600}
                    className="w-2/3 h-auto object-cover about-image-hover mx-auto"
                    priority
                  />
                </div>
                {/* Stats Section */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="text-center about-stat-item">
                    <div className="about-stat-number text-4xl md:text-5xl font-bold mb-2">
                      4+
                    </div>
                    <div className="text-white/80 text-sm md:text-base">
                      سال تجربه
                    </div>
                  </div>
                  <div className="text-center about-stat-item">
                    <div className="about-stat-number text-4xl md:text-5xl font-bold mb-2">
                      ۱۰۰۰+
                    </div>
                    <div className="text-white/80 text-sm md:text-base">
                      محصول متنوع
                    </div>
                  </div>
                  <div className="text-center about-stat-item">
                    <div className="about-stat-number text-4xl md:text-5xl font-bold mb-2">
                      ۹۹٪
                    </div>
                    <div className="text-white/80 text-sm md:text-base">
                      رضایت مشتری
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
