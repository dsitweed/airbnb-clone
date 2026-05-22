'use client';

import { useLoadMore } from '@/hooks/useLoadMore';
import { Listing } from '@/lib/generated/prisma/client';
import { GetListingQuery } from '@/types/api';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

import { Skeleton } from './ui/skeleton';

interface LoadMoreResponse {
  listings: Listing[];
  nextCursor: null | string;
}

interface LoadMoreProps {
  nextCursor: string;
  fnArgs: GetListingQuery;
  queryFn: (args: Record<string, string>) => Promise<LoadMoreResponse>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryKey: readonly any[];
  favorites: string[];
}

export default function LoadMore({
  nextCursor,
  fnArgs,
  queryFn,
  queryKey,
  favorites,
}: LoadMoreProps) {
  const baseArgs = Object.fromEntries(
    Object.entries(fnArgs ?? {}).filter(([, value]) => value !== undefined),
  ) as Record<string, string>;

  const { data, isFetchingNextPage, hasNextPage, status, fetchNextPage } =
    useInfiniteQuery({
      initialPageParam: nextCursor,
      queryFn: ({ pageParam }) => queryFn({ ...baseArgs, cursor: pageParam }),
      queryKey,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  const { ref } = useLoadMore({
    loadMoreData: fetchNextPage,
    hasMoreData: hasNextPage,
    isLoading: status === 'pending' || isFetchingNextPage,
    isError: status === 'error',
  });

  return (
    <>
      {data?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.listings.map((listing) => {
            const hasFavorited = favorites.includes(listing.id);
            return (
              <div key={listing.id}>
                {/* FIXME */}
                TEST <p>{hasFavorited ? 'like' : 'not like'}</p>
              </div>
            );
          })}
        </React.Fragment>
      ))}
      {(status === 'pending' || isFetchingNextPage) && (
        <Skeleton>Loading</Skeleton>
      )}
      {status === 'error' && <p>Something went wrong!</p>}
      <div ref={ref} />
    </>
  );
}
