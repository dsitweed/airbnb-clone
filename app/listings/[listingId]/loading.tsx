'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useLayoutEffect } from 'react';

export default function Loading() {
  useLayoutEffect(() => {
    if (typeof window === undefined) return;

    window.scroll(0, 0);
  }, []);

  return <Skeleton />;
}
