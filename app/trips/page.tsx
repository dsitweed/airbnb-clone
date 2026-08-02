import EmptyState from '@/components/EmptyState';
import Heading from '@/components/Heading';
import ListingCard from '@/components/ListingCard';
import LoadMore from '@/components/LoadMore';
import { getFavorites } from '@/services/favorite';
import { getReservations } from '@/services/reservation';
import { getCurrentUser } from '@/services/user';
import { Suspense } from 'react';

export default async function TripsPage() {
  const user = await getCurrentUser();

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

  const favorites = await getFavorites();
  const { listings, nextCursor } = await getReservations({
    userId: user.id,
  });

  if (listings.length === 0) {
    return (
      <div className="main-container flex justify-center">
        <EmptyState
          title="No trips found"
          subTitle="Look like you haven't reserved any trip"
          refreshAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <section className="main-container">
      <Heading
        title="Trips"
        subTitle="Where you've been and where you're going."
        backBtn
      />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-10 lg:grid-cols-4 lg:gap-8">
        {listings.map((listing) => {
          const { reservation, ...data } = listing;
          const isFavorite = favorites.includes(listing.id);

          return (
            <ListingCard
              key={listing.id}
              data={data}
              isFavorite={isFavorite}
              reservation={reservation}
            />
          );
        })}
        {nextCursor ? (
          <Suspense>
            <LoadMore
              nextCursor={nextCursor}
              fnArgs={{ userId: user.id }}
              queryFn={getReservations}
              queryKey={['trips', user.id]}
              favorites={favorites}
            />
          </Suspense>
        ) : null}
      </div>
    </section>
  );
}
