"use client";

import { useState } from "react";

interface ImageTestProps {
  imageUrl: string;
  alt: string;
}

export function ImageTest({ imageUrl, alt }: ImageTestProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full bg-red-100 flex items-center justify-center text-red-600">
        <div className="text-center">
          <div className="text-2xl mb-2">❌</div>
          <p className="text-sm">خطا در بارگذاری</p>
          <p className="text-xs text-red-400 mt-1">{imageUrl}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500">در حال بارگذاری...</div>
        </div>
      )}
    </div>
  );
}
