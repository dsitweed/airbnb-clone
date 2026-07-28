import EmptyState from '@/components/EmptyState';
import { getListingId } from '@/services/listing';

import ListingHead from './_components/ListingHead';

interface IParams {
  params: Promise<{
    listingId: string;
  }>;
}

export default async function ListingPage(props: IParams) {
  const { listingId } = await props.params;
  const listingData = await getListingId(listingId);

  if (!listingData) {
    return (
      <EmptyState
        title={''}
        subTitle={''}
        refreshAction={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
  }

  return (
    <section className="main-container">
      <ListingHead
        title={listingData.title}
        country={listingData.country}
        region={listingData.region}
        image={listingData.imageSrc}
        id={listingData.id}
      />
    </section>
  );
}
