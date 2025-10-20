"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageTest } from "./ImageTest";

interface ProductImageGalleryProps {
  imageUrls: string;
  productName: string;
}

export function ProductImageGallery({ imageUrls, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [useImageTest, setUseImageTest] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  // Convert single string to array for compatibility
  const imageArray = useMemo(() => {
    return imageUrls ? (imageUrls.includes(',') ? imageUrls.split(',') : [imageUrls]) : [];
  }, [imageUrls]);

  // Debug logging
  useEffect(() => {
    console.log('ProductImageGallery - imageUrls:', imageUrls);
    console.log('ProductImageGallery - imageArray:', imageArray);
    console.log('ProductImageGallery - selectedImage:', selectedImage);
    console.log('ProductImageGallery - mainImage:', imageArray[selectedImage]);
  }, [imageUrls, imageArray, selectedImage]);

  // Keyboard navigation for full-screen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) return;
      
      switch (e.key) {
        case 'Escape':
          setIsZoomed(false);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedImage(prev => prev > 0 ? prev - 1 : imageArray.length - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setSelectedImage(prev => prev < imageArray.length - 1 ? prev + 1 : 0);
          break;
      }
    };

    if (isZoomed) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed, imageArray.length]);

  if (!imageArray || imageArray.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <div className="text-4xl mb-2">📷</div>
          <p>تصویر موجود نیست</p>
        </div>
      </div>
    );
  }

  const mainImage = imageArray[selectedImage];

  const handleImageError = () => {
    console.log('Image error occurred for:', mainImage);
    if (!useFallback) {
      console.log('Switching to fallback mode');
      setUseFallback(true);
    } else if (!useImageTest) {
      console.log('Switching to ImageTest mode');
      setUseImageTest(true);
    } else {
      console.log('All fallbacks failed, showing error');
      setImageError(true);
    }
  };

  const testImageUrl = () => {
    window.open(mainImage, '_blank');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage position
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // setMousePosition({ x, y });
    setZoomPosition({ x: percentX, y: percentY });
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const handlePreviousImage = () => {
    setSelectedImage(prev => prev > 0 ? prev - 1 : imageArray.length - 1);
  };

  const handleNextImage = () => {
    setSelectedImage(prev => prev < imageArray.length - 1 ? prev + 1 : 0);
  };

  if (imageError) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <div className="text-4xl mb-2">❌</div>
          <p>خطا در بارگذاری تصویر</p>
          <p className="text-xs text-gray-400 mb-2">URL: {mainImage}</p>
          <div className="space-y-2 mt-3">
            <button 
              onClick={testImageUrl}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              تست URL در تب جدید
            </button>
            <br />
            <button 
              onClick={() => {
                setImageError(false);
                setUseFallback(false);
                setUseImageTest(false);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderMainImage = () => {
    if (useImageTest) {
      return (
        <ImageTest
          imageUrl={mainImage}
          alt={`${productName} - تصویر ${selectedImage + 1}`}
        />
      );
    }

    if (useFallback) {
      return (
        <Image
          src={mainImage}
          alt={`${productName} - تصویر ${selectedImage + 1}`}
          fill
          className="object-cover"
          onError={handleImageError}
          unoptimized={mainImage.startsWith('/uploads/')}
        />
      );
    }

    return (
      <Image
        src={mainImage}
        alt={`${productName} - تصویر ${selectedImage + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        priority
        onError={handleImageError}
        unoptimized={mainImage.startsWith('/uploads/')}
      />
    );
  };

  const renderThumbnail = (url: string, index: number) => {
    if (useImageTest) {
      return (
        <ImageTest
          imageUrl={url}
          alt={`${productName} - تصویر کوچک ${index + 1}`}
        />
      );
    }

    if (useFallback) {
      return (
        <Image
          src={url}
          alt={`${productName} - تصویر کوچک ${index + 1}`}
          width={80}
          height={80}
          className="w-full h-full object-cover"
          onError={handleImageError}
          unoptimized={url.startsWith('/uploads/')}
        />
      );
    }

    return (
      <Image
        src={url}
        alt={`${productName} - تصویر کوچک ${index + 1}`}
        width={80}
        height={80}
        className="w-full h-full object-cover"
        unoptimized={url.startsWith('/uploads/')}
        onError={handleImageError}
      />
    );
  };

  const renderZoomImage = () => {
    if (useImageTest) {
      return (
        <ImageTest
          imageUrl={mainImage}
          alt={`${productName} - تصویر بزرگ ${selectedImage + 1}`}
        />
      );
    }

    if (useFallback) {
      return (
        <Image
          src={mainImage}
          alt={`${productName} - تصویر بزرگ ${selectedImage + 1}`}
          width={1200}
          height={900}
          className="w-full h-auto max-h-[90vh] object-contain"
          onError={handleImageError}
          unoptimized={mainImage.startsWith('/uploads/')}
        />
      );
    }

    return (
      <Image
        src={mainImage}
        alt={`${productName} - تصویر بزرگ ${selectedImage + 1}`}
        width={1200}
        height={900}
        className="w-full h-auto max-h-[90vh] object-contain"
        priority
        unoptimized={mainImage.startsWith('/uploads/')}
        onError={handleImageError}
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image with Hover Zoom */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {/* Main Image Container */}
        <div
          ref={imageRef}
          className="relative w-full h-full cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsZoomed(true)}
        >
          {renderMainImage()}
          
          {/* Zoom Indicator */}
          <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            <ZoomIn className="w-4 h-4" />
          </div>

          {/* Image Counter */}
          <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
            {selectedImage + 1} / {imageArray.length}
          </div>
        </div>

        {/* Hover Zoom Overlay */}
        {showZoom && (
          <div
            ref={zoomRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            style={{
              background: `url(${mainImage})`,
              backgroundSize: '300%',
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
      </div>

      {/* Thumbnail Gallery */}
      {imageArray.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageArray.map((url, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setImageError(false);
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedImage === index
                  ? "border-indigo-500 ring-2 ring-indigo-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {renderThumbnail(url, index)}
            </button>
          ))}
        </div>
      )}

             {/* Full Screen Zoom Modal - با z-index بالا برای پوشش کامل صفحه */}
       {isZoomed && typeof window !== "undefined" && createPortal(
         <div 
           className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-4"
           style={{ zIndex: 999999 }}
         >
           <div className="relative w-full h-full flex items-center justify-center">
             {/* Close Button */}
             <button
               onClick={() => setIsZoomed(false)}
               className="absolute top-6 right-6 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
               style={{ zIndex: 1000000 }}
               aria-label="بستن"
             >
               <X className="w-6 h-6 text-black" />
             </button>

             {/* Previous Button */}
             {imageArray.length > 1 && (
               <button
                 onClick={handlePreviousImage}
                 className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
                 style={{ zIndex: 1000000 }}
                 aria-label="تصویر قبلی"
               >
                 <ChevronLeft className="w-6 h-6 text-black" />
               </button>
             )}

             {/* Next Button */}
             {imageArray.length > 1 && (
               <button
                 onClick={handleNextImage}
                 className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
                 style={{ zIndex: 1000000 }}
                 aria-label="تصویر بعدی"
               >
                 <ChevronRight className="w-6 h-6 text-black" />
               </button>
             )}
             
             {/* Main Image */}
             <div className="relative w-full h-full flex items-center justify-center">
               {renderZoomImage()}
             </div>

             {/* Image Counter */}
             <div 
               className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full backdrop-blur-sm"
               style={{ zIndex: 1000000 }}
             >
               {selectedImage + 1} / {imageArray.length}
             </div>

             {/* Navigation Dots */}
             {imageArray.length > 1 && (
               <div 
                 className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex justify-center gap-2"
                 style={{ zIndex: 1000000 }}
               >
                 {imageArray.map((_, index) => (
                   <button
                     key={index}
                     onClick={() => setSelectedImage(index)}
                     className={`w-3 h-3 rounded-full transition-all duration-200 ${
                       selectedImage === index
                         ? "bg-white"
                         : "bg-white bg-opacity-50 hover:bg-opacity-75"
                     }`}
                     aria-label={`تصویر ${index + 1}`}
                   />
                 ))}
               </div>
             )}

             {/* Keyboard Navigation Hint */}
             <div 
               className="absolute top-6 left-6 text-white text-sm bg-black bg-opacity-50 px-3 py-2 rounded-lg backdrop-blur-sm"
               style={{ zIndex: 1000000 }}
             >
               <div>برای حرکت: ← →</div>
               <div>برای بستن: ESC</div>
             </div>
           </div>
         </div>,
         document.body
       )}
    </div>
  );
}
