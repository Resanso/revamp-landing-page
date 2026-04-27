"use client";

import Image from "next/image";
import { useState, useEffect, CSSProperties } from "react";
import { AboutSlide } from "@/data/about-content";

type AboutGalleryClientProps = {
  slides: AboutSlide[];
};

export default function AboutGalleryClient({
  slides,
}: AboutGalleryClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 detik

    return () => clearInterval(interval); 
  }, [slides]);

  const displaySlides = [...slides, ...slides, ...slides];

  return (
    <div className="relative w-full overflow-hidden pb-8 pt-4">
      <div
        className="flex transition-transform duration-500 ease-in-out max-md:-translate-x-[calc(var(--slide-index)*100%)] md:-translate-x-[calc(var(--slide-index)*33.3333%)]"
        style={{ "--slide-index": currentIndex } as CSSProperties}
      >
        {displaySlides.map((slide, index) => {
          const isCenterDesktop = index === currentIndex + 1;
          const isCenterMobile = index === currentIndex;

          return (
            <div
              key={`${index}-${slide.src}`}
              className={`flex-none w-full md:w-1/3 px-0 md:px-2 transition-all duration-500 
                ${isCenterDesktop ? "md:-translate-y-2 md:scale-105 md:z-10" : "md:scale-90"}
                ${isCenterMobile ? "scale-100 opacity-100" : "scale-95 opacity-0"} md:opacity-100
              `}
            >
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
                <Image
                  src={slide.src}
                  alt={slide.alt || "Gallery image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* CAROUSEL INDICATORS */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {slides.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-[#FFC72C]"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
