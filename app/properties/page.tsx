import EmptyState from '@/components/EmptyState';
import Heading from '@/components/Heading';
import ListingCard from '@/components/ListingCard';
import LoadMore from '@/components/LoadMore';
import { getFavorites } from '@/services/favorite';
import { getProperties } from '@/services/property';
import { getCurrentUser } from '@/services/user';
import { Suspense } from 'react';

export default async function PropertiesPage() {
  const user = await getCurrentUser();
  const favorites = await getFavorites();

  if (!user) {
    return (
      <div className="main-container flex justify-center">
        <EmptyState
          title="Unauthorized"
          subTitle="Please login"
          refreshAction={() => window.location.reload()}
        />
      </div>
    );
  }

  const { listings, nextCursor } = await getProperties({ userId: user.id });

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        subTitle="Looks like you have no properties"
        refreshAction={() => window.location.reload()}
      />
    );
  }

  return (
    <section className="main-container">
      <Heading title="Properties" subTitle="List of your properties" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-10 lg:grid-cols-4 lg:gap-8">
        {listings.map((listing) => {
          const isFavorite = favorites.includes(listing.id);

          return (
            <ListingCard
              key={listing.id}
              data={listing}
              isFavorite={isFavorite}
            />
          );
        })}
        {!nextCursor ? null : (
          <Suspense fallback={<></>}>
            <LoadMore
              nextCursor={nextCursor}
              fnArgs={{ userId: user.id }}
              queryFn={getProperties}
              queryKey={['properties', user.id]}
              favorites={favorites}
            />
          </Suspense>
        )}
      </div>
    </section>
  );
}
