'use client';

import { cn, throttle } from '@/lib/utils';
import { categories } from '@/utils/constants';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import CategoryBox from './CategoryBox';

export default function Categories() {
  const [isActive, setIsActive] = useState(false);

  const params = useSearchParams();
  const pathName = usePathname();
  const currentCategory = params.get('category');

  const isMainPage = pathName === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 150);

    window.addEventListener('scroll', throttledHandleScroll);
  }, []);

  if (!isMainPage) {
    return;
  }

  return (
    <div
      className={cn(
        'transition-all duration-75',
        isActive && 'shadow-md shadow-amber-100',
      )}
    >
      <Swiper
        slidesPerView="auto"
        pagination={{
          clickable: true,
        }}
        className="main-container mt-2 px-2 lg:px-3"
      >
        {categories.map((category) => (
          <SwiperSlide key={category.label} className="max-w-fit">
            <CategoryBox
              label={category.label}
              icon={category.icon}
              selected={currentCategory === category.label}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
