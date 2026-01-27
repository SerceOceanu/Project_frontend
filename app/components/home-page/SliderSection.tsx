'use client';
import { useCallback, useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import { Banner } from '@/types/types';

type SliderSectionProps = {
  banners: Banner[];
};

export default function SliderSection({ banners }: SliderSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // If no banners, use default image
  const slides = banners.length > 0 
    ? banners.map((banner) => ({
        id: banner.id,
        imageUrl: banner.fileUrl,
        name: banner.name,
      }))
    : [{
        id: 0,
        imageUrl: '/assets/images/default.webp',
        name: 'Default Banner',
      }];

  const scrollTo = useCallback(
    (index: number) => api?.scrollTo(index),
    [api]
  );

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative w-full pb-6 md:px-0  overflow-hidden  lg:pb-0">
      <Carousel
        setApi={setApi}
        className="w-full h-[370px] lg:h-[400px] lg:h-[600px] xl:h-[800px] overflow-hidden rounded-xl lg:rounded-none "
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent className="h-screen">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="relative w-full h-screen">
              <div className="relative w-full h-full">
                <Image
                  src={slide.imageUrl}
                  alt={slide.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Точки навигации */}
      {slides.length > 1 && (
      <div className="absolute bottom-0 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: Math.min(slides.length, 5) }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`size-3 cursor-pointer rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-blue w-8'
                : 'bg-[#5386C4] hover:bg-[#5386C4]/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      )}
    </section>
  );
}