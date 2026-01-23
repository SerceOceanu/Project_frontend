'use client';
import { useState, useEffect } from 'react';
import { Link } from '@/lib/navigation';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import ProductCard from './ProductCard';
import { useTranslations } from 'next-intl';
import { Product } from '@/types/types';


export default function ProductsSlider({ href, products }: { href: string, products: Product[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const t = useTranslations();
  useEffect(() => {
    if (!api) return;

    const updateScrollButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateScrollButtons();
    api.on('select', updateScrollButtons);
    api.on('reInit', updateScrollButtons);

    return () => {
      api.off('select', updateScrollButtons);
    };
  }, [api]);



  return (
    <section className="container ">
      <div className="relative">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 py-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 hover">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex items-center justify-between mt-10">
            <Link href={href}>
              <Button variant="outline" className="inter text-[18px] font-bold border-dark-blue text-dark-blue h-[52px] px-6">
                {t('see-all')}
              </Button>
            </Link>
            
            <div className="flex gap-5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
                className="size-14 rounded-xl text-orange border-2 border-orange  hover:text-orange disabled:border-[1px]"
              >
                <FaChevronLeft className=" size-[20px]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
                className="size-14 rounded-xl text-orange border-2 border-orange  hover:text-orange  disabled:border-[1px]"
              >
                <FaChevronRight className=" size-[20px]" />
              </Button>
            </div>
          </div>
        </Carousel> 
      </div>
    </section>
  );
}

