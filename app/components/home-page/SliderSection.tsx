'use client';
import { useCallback, useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import { Banner } from '@/types/types';
import { useLocale } from 'next-intl';

type SliderSectionProps = {
  banners: Banner[];
};

export default function SliderSection({ banners }: SliderSectionProps) {
  const locale = useLocale();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const slides = banners.length > 0 
    ? banners.map((banner) => {
        const imageUrl = locale === 'pl' 
          ? (banner.fileUrlPL || '/assets/images/default.webp')
          : (banner.fileUrlUA || '/assets/images/default.webp');
        const name = locale === 'pl' 
          ? (banner.namePL || 'Default Banner')
          : (banner.nameUA || 'Default Banner');
        
        return {
          id: banner.id,
          imageUrl,
          name,
        };
      })
    : [{
        id: '0',
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
    <section className="relative w-full sm:px-6 md:px-8 xl:px-30 overflow-hidden lg:pb-0">
      <Carousel
        setApi={setApi}
        className="w-full overflow-hidden rounded-4xl xl:rounded-[50px] relative"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="relative w-full">
              <div className="relative w-full overflow-hidden rounded-4xl">
                <Image
                  src={slide.imageUrl}
                  alt={slide.name}
                  width={1920}
                  height={1080} 
                  className="w-full h-auto object-cover rounded-4xl"
                  sizes="100vw"
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {slides.length > 1 && (
          <div className="absolute bottom-2 md:bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10 px-2 md:px-4 py-1 md:py-2 rounded-full backdrop-blur-xl bg-white/30">
            {Array.from({ length: Math.min(slides.length, 5) }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`size-3 md:size-4 cursor-pointer rounded-full transition-all duration-300 ${
                  index === current
                    ? 'bg-orange w-8'
                    : 'bg-orange/50 hover:bg-orange/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </section>
  );
}