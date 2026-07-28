'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

interface CustomImageProps {
  imageSrc: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  effect?: string;
  sizes?: string;
}

export default function CustomImage({
  imageSrc,
  alt,
  className,
  fill = false,
  priority = false,
  effect = 'zoom',
  sizes,
}: CustomImageProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Image
      fill={fill}
      className={cn(
        'transition duration-300',
        effect === 'zoom' && 'scale-95',
        isImageLoaded ? 'scale-100 opacity-100' : 'opacity-0',
        className,
      )}
      src={imageSrc}
      alt={alt}
      priority={priority}
      sizes={sizes}
      onLoad={() => setIsImageLoaded(true)}
      unoptimized
    />
  );
}
