import EmptyState from '@/components/EmptyState';
import ListingCard from '@/components/ListingCardt';
import LoadMore from '@/components/LoadMore';
import { getFavorites } from '@/services/favorite';
import { getListing } from '@/services/listing';
import { GetListingQuery } from '@/types/api';
import { Suspense } from 'react';

interface HomeProps {
  searchParams: GetListingQuery;
}

export default async function Home({ searchParams }: HomeProps) {
  const { listings, nextCursor } = await getListing(searchParams);
  const favorites = await getFavorites();

  if (!listings || listings.length === 0) {
    return (
      <div className="flex justify-center">
        <EmptyState
          title="No Listings found"
          subTitle="Looks like you have no properties."
          refreshAction={() => console.log('Refresh home page')}
        />
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-4 pt-16 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
      {listings.map((listing) => (
        <div key={`listing-card-${listing.id}`}>
          <ListingCard
            data={listing}
            hasFavorited={favorites.includes(listing.id)}
          />
        </div>
      ))}

      {nextCursor ? (
        <Suspense>
          <LoadMore
            nextCursor={nextCursor}
            fnArgs={searchParams}
            queryFn={getListing}
            queryKey={['listings', searchParams]}
            favorites={favorites}
          />
        </Suspense>
      ) : null}
    </section>
  );
}
