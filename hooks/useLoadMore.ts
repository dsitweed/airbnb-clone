import { useEffect, useRef } from 'react';

interface Props {
  loadMoreData: () => void;
  hasMoreData: boolean;
  isLoading: boolean;
  isError: boolean;
}

export const useLoadMore = ({
  loadMoreData,
  hasMoreData,
  isLoading,
  isError,
}: Props) => {
  const ref = useRef(null);

  useEffect(() => {
    const callbackFn = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];

      if (!entry.isIntersecting) return;

      if (!isLoading && !isError && hasMoreData) {
        loadMoreData();
      }
    };

    const observer = new IntersectionObserver(callbackFn, {
      root: null,
      rootMargin: '240px',
      threshold: 0.1,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasMoreData, loadMoreData, isLoading, isError]);

  return { ref };
};
