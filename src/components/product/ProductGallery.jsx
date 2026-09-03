import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Badge from '../common/Badge';

export default function ProductGallery({ images = [], name = 'Product', discount = 0, isNew = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return <div className="aspect-[3/4] bg-zinc-100" />;
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnail List */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-20 shrink-0 no-scrollbar py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[3/4] w-16 lg:w-full overflow-hidden border-2 transition-all ${
                currentIndex === idx
                  ? 'border-zinc-950 opacity-100 ring-1 ring-zinc-950'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="relative flex-1 aspect-[3/4] bg-zinc-100 overflow-hidden group">
        <img
          src={images[currentIndex]}
          alt={`${name} view ${currentIndex + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          {discount > 0 && <Badge variant="sale">-{discount}% Off</Badge>}
          {isNew && <Badge variant="dark">New Arrival</Badge>}
        </div>

        {/* Carousel arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-zinc-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-zinc-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter pill */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 tracking-wider uppercase font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
