'use client';

import { cn, throttle } from '@/lib/utils';
import { categories } from '@/utils/constants';
import useEmblaCarousel from 'embla-carousel-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import CategoryBox from './CategoryBox';

export default function Categories() {
  const [isActive, setIsActive] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    align: 'start',
  });

  const params = useSearchParams();
  const pathName = usePathname();
  const currentCategory = params.get('category');

  const isMainPage = pathName === '/';

  useEffect(() => {
    const handleScroll = () => setIsActive(window.scrollY > 0);

    const throttledHandleScroll = throttle(handleScroll, 150);

    handleScroll();
    window.addEventListener('scroll', throttledHandleScroll);

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      const scrollable = emblaApi.canScrollNext() || emblaApi.canScrollPrev();
      emblaApi.reInit({
        watchDrag: scrollable,
        dragFree: true,
        align: 'start',
      });
    };
    emblaApi.on('resize', update);
    update();

    return () => {
      emblaApi.off('resize', update);
    };
  }, [emblaApi]);

  if (!isMainPage) {
    return null;
  }

  return (
    <div
      className={cn(
        'transition-all duration-75',
        isActive && 'shadow-md shadow-amber-100',
      )}
    >
      <div
        className="embla main-container mt-2 overflow-hidden px-2 lg:px-3"
        ref={emblaRef}
      >
        <div className="embla__container flex">
          {categories.map((category) => (
            <div
              className="embla__slide min-w-0 shrink-0 grow-0 basis-auto"
              key={category.label}
            >
              <CategoryBox
                label={category.label}
                icon={category.icon}
                selected={currentCategory === category.label}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
