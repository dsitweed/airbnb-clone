import Heading from '@/components/Heading';
import HeartButton from '@/components/HeartButton';
import CustomImage from '@/components/Image';
import { getFavorites } from '@/services/favorite';

interface ListingHeadProps {
  title: string;
  country: string | null;
  region: string | null;
  image: string;
  id: string;
}

export default async function ListingHead({
  title,
  country,
  region,
  image,
  id,
}: ListingHeadProps) {
  const favorites = await getFavorites();
  const isFavorite = favorites.includes(id);

  return (
    <>
      <Heading title={title} subTitle={[country, region].join(',')} backBtn />
      <div className="relative mt-4 h-[260px] w-full overflow-hidden rounded-xl bg-gray-100 transition duration-300 sm:h-[280px] md:h-[420px]">
        <CustomImage
          imageSrc={image}
          alt={`head image of ${id}`}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} isFavorite={isFavorite} />
        </div>
      </div>
    </>
  );
}
