'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/lib/generated/prisma/client';
import { Category } from '@/types/common';
import { DEFAULT_AVATAR_URL } from '@/utils/constants';
import { LatLngTuple } from 'leaflet';
import dynamic from 'next/dynamic';

import ListingCategory from './ListingCategory';

interface ListingInfoProps {
  user: Pick<User, 'name' | 'image'>;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category: Category | undefined;
  latlng: number[];
}

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

export default function ListingInfo({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  latlng,
}: ListingInfoProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-base font-semibold">
          <span className="mr-1 flex items-center gap-2">
            Hosted by{' '}
            <span>
              <Avatar>
                <AvatarImage src={user.image ?? DEFAULT_AVATAR_URL} />
              </Avatar>
            </span>
          </span>
          <span>{user.name}</span>
        </div>
        <div className="space-x-5 text-neutral-500">
          <span>{guestCount} guests</span>
          <span>{roomCount} rooms</span>
          <span>{bathroomCount} bathrooms</span>
        </div>
      </div>
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}
      <div>
        <p className="text-lg font-bold">Description</p>
        <p className="text-base font-light text-neutral-500">{description}</p>
      </div>
      <div className="h-60">
        <Map center={latlng as LatLngTuple} />
      </div>
    </div>
  );
}
