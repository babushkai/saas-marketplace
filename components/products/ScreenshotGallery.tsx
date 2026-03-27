"use client";

import Image from "next/image";

interface ScreenshotGalleryProps {
  screenshots: string[];
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        スクリーンショット
      </h2>

      {/* Mobile: horizontal scroll */}
      <div className="md:hidden overflow-x-auto flex gap-3 pb-2 scrollbar-thin -mx-2 px-2">
        {screenshots.map((url, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 relative w-64 h-40 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-zoom-in"
          >
            <Image
              src={url}
              alt={`Screenshot ${i + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </a>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {screenshots.map((url, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-video rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-zoom-in group"
          >
            <Image
              src={url}
              alt={`Screenshot ${i + 1}`}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
              unoptimized
            />
          </a>
        ))}
      </div>
    </div>
  );
}
