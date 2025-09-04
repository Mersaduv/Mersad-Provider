"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SliderItem {
  id: string;
  title: string;
  link?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export default function Slider() {
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await fetch("/api/sliders");
      if (response.ok) {
        const data = await response.json();
        setSliders(data);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  if (sliders.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white/50",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-white",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={sliders.length > 1}
        className="slider-container rounded-lg overflow-hidden shadow-lg"
      >
        {sliders.map((slider) => (
          <SwiperSlide key={slider.id}>
            {slider.link ? (
              <Link href={slider.link} className="block w-full h-96 md:h-[500px] relative group cursor-pointer">
                <Image
                  src={slider.imageUrl}
                  alt={slider.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                      {slider.title}
                    </h2>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="relative w-full h-96 md:h-[500px]">
                <Image
                  src={slider.imageUrl}
                  alt={slider.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                      {slider.title}
                    </h2>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
        
        {/* Custom Navigation Buttons - Hidden on mobile */}
        <div className="swiper-button-prev !text-white !w-12 !h-12 !mt-0 !top-1/2 !-translate-y-1/2 !right-4 !left-auto !bg-black/20 !backdrop-blur-sm !rounded-full !border !border-white/30 hover:!bg-black/40 transition-all duration-300"></div>
        <div className="swiper-button-next !text-white !w-12 !h-12 !mt-0 !top-1/2 !-translate-y-1/2 !left-4 !right-auto !bg-black/20 !backdrop-blur-sm !rounded-full !border !border-white/30 hover:!bg-black/40 transition-all duration-300"></div>
        
        {/* Custom Pagination */}
        <div className="swiper-pagination !bottom-4"></div>
      </Swiper>

      <style jsx global>{`
        .slider-container .swiper-button-prev:after,
        .slider-container .swiper-button-next:after {
          font-size: 18px;
          font-weight: bold;
        }
        
        .slider-container .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          margin: 0 6px;
          opacity: 1;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .slider-container .swiper-pagination-bullet-active {
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .slider-container .swiper-button-prev,
          .slider-container .swiper-button-next {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
