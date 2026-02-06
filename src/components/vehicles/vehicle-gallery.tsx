"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface VehicleImage {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean | null;
  sortOrder: number | null;
}

interface VehicleGalleryProps {
  images: VehicleImage[];
  vehicleName: string;
}

export function VehicleGallery({ images, vehicleName }: VehicleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelectedIndex(index);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    },
    [images.length],
  );

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border bg-muted">
        <div className="flex aspect-[16/10] items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-12 w-12" />
            <p className="text-sm font-medium">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-xl border bg-muted">
        <div className="aspect-[16/10]">
          <Image
            src={currentImage.url}
            alt={currentImage.alt ?? `${vehicleName} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 720px"
            priority={selectedIndex === 0}
          />
        </div>
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="listbox"
          aria-label="Vehicle image thumbnails"
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="option"
              aria-selected={index === selectedIndex}
              aria-label={`View image ${index + 1} of ${images.length}`}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                index === selectedIndex
                  ? "border-primary ring-1 ring-primary/20"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
              onClick={() => handleThumbnailClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <Image
                src={image.url}
                alt={image.alt ?? `${vehicleName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
