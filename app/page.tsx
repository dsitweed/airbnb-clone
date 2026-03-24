import EmptyState from '@/components/EmptyState';
import ListingCard from '@/components/ListingCardt';
import { getFavorites } from '@/services/favorite';
import { getListing } from '@/services/listing';
import { GetListingQuery } from '@/types/api';

interface HomeProps {
  searchParams: Promise<GetListingQuery>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const { listings, nextCursor } = await getListing(params);
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
    <section>
      {listings.map((listing) => (
        <div key={`listing-card-${listing.id}`} className="w-100">
          <ListingCard
            data={listing}
            hasFavorited={favorites.includes(listing.id)}
          />
        </div>
      ))}
    </section>
  );
}
