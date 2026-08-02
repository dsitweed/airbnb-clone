import EmptyState from '@/components/EmptyState';
import { getListingId } from '@/services/listing';
import { getCurrentUser } from '@/services/user';

import ListingHead from './_components/ListingHead';
import ListingInfo from './_components/ListingInfo';
import ListingView from './_components/ListingView';

interface IParams {
  params: Promise<{
    listingId: string;
  }>;
}

export default async function ListingPage(props: IParams) {
  const { listingId } = await props.params;
  const listingData = await getListingId(listingId);
  const currentUser = await getCurrentUser();

  if (!listingData) {
    return (
      <div className="main-container flex justify-center">
        <EmptyState
          title=""
          subTitle=""
          refreshAction={() => window.location.reload()}
        />
      </div>
    );
  }

  const {
    title,
    imageSrc,
    country,
    region,
    id,
    description,
    guestCount,
    roomCount,
    bathroomCount,
    category,
    latlng,
    price,
  } = listingData;

  return (
    <section className="main-container">
      <ListingHead
        title={title}
        country={country}
        region={region}
        image={imageSrc}
        id={id}
      />

      <div className="mt-6 grid grid-cols-2 gap-10">
        <ListingInfo
          user={{
            image: currentUser?.image ?? null,
            name: currentUser?.name ?? 'User',
          }}
          description={description}
          guestCount={guestCount}
          roomCount={roomCount}
          bathroomCount={bathroomCount}
          category={undefined}
          latlng={latlng}
        />
        <ListingView id={id} title={title} price={price} user={currentUser} />
      </div>
    </section>
  );
}
