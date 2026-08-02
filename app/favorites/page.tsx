import EmptyState from '@/components/EmptyState';
import Heading from '@/components/Heading';
import ListingCard from '@/components/ListingCard';
import { getFavoriteListings } from '@/services/favorite';
import { getCurrentUser } from '@/services/user';

export default async function FavoritesPage() {
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

  const favoriteListings = await getFavoriteListings();

  if (favoriteListings.length === 0) {
    return (
      <div className="main-container flex justify-center">
        <EmptyState
          title="No favorites found"
          subTitle="Look live you have no favorite listing"
          refreshAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <section className="main-container">
      <Heading title="Favorites" subTitle="List of places you favorites!" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-10 lg:grid-cols-4 lg:gap-8">
        {favoriteListings.map((listing) => (
          <ListingCard key={listing.id} data={listing} isFavorite />
        ))}
      </div>
    </section>
  );
}
