import { Listing, Reservation } from '@/lib/generated/prisma/client';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import HeartButton from './HeartButton';
import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface ListingCardProps {
  data: Listing;
  reservation?: Reservation;
  hasFavorited: boolean;
}

export default function ListingCard({
  data,
  reservation,
  hasFavorited,
}: ListingCardProps) {
  const price = reservation ? reservation.totalPrice : data.price;
  let reservationDate;

  if (reservation) {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    reservationDate = `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-10 flex items-center p-3">
        <div className="flex h-7 w-7 items-center justify-center">
          <HeartButton listingId={data.id} hasFavorited={hasFavorited} />
        </div>
      </div>
      <Link href={`/listings/${data.id}`} className="col-span-1 cursor-pointer">
        <div className="flex w-full flex-col gap-1">
          <div className="overflow-hidden rounded-md md:rounded-xl">
            <div className="relative aspect-[1/0.95] bg-gray-100">
              <Image
                src={data.imageSrc}
                fill
                alt={data.title}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
          <span className="mt-1 text-base font-semibold">
            {data.region}, {data.country}
          </span>
          <span className="text-sm font-light text-neutral-500">
            {reservationDate || data.category}
          </span>

          <div className="flex flex-row items-baseline gap-1">
            <span className="text-sm font-bold">{price} $</span>
            {!reservation && <span className="">night</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}

export const ListingSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
};
