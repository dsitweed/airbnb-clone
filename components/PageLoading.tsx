'use client';

import { useLayoutEffect } from 'react';

import { Skeleton } from './ui/skeleton';

export default function PageLoading() {
  useLayoutEffect(() => {
    if (typeof window === undefined) return;

    window.scroll(0, 0);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-4 p-6">
      <div className="grid w-full gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="aspect-video w-full" />
    </div>
  );
}
