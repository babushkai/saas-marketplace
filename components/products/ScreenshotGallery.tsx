"use client";

import { useState } from "react";
import Image from "next/image";

interface ScreenshotGalleryProps {
  screenshots: string[];
}

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeScreenshots = (screenshots ?? []).filter(isSafeUrl);
  if (safeScreenshots.length === 0) return null;

  const activeUrl = safeScreenshots[activeIndex] ?? safeScreenshots[0];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <a
        href={activeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full max-h-64 sm:max-h-80 lg:max-h-none lg:aspect-video rounded-xl overflow-hidden group cursor-zoom-in bg-gray-100"
      >
        <Image
          src={activeUrl}
          alt={`Screenshot ${activeIndex + 1}`}
          fill
          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          拡大
        </div>
      </a>

      {/* Thumbnail strip */}
      {safeScreenshots.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {safeScreenshots.map((url, i) => (
            <button
              key={url}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all ${
                i === activeIndex
                  ? "ring-2 ring-primary-500 ring-offset-2 opacity-100"
                  : "opacity-60 hover:opacity-90"
              }`}
              aria-label={`Screenshot ${i + 1}`}
            >
              <Image
                src={url}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
