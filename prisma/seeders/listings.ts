import { PrismaClient } from '@/lib/generated/prisma/client';

import { SEED_IDS } from './constants';

export async function seedListings(prisma: PrismaClient) {
  const cozyStudio = await prisma.listing.upsert({
    where: { id: SEED_IDS.listings.cozyStudio },
    update: {
      price: 42,
    },
    create: {
      id: SEED_IDS.listings.cozyStudio,
      title: 'Cozy Studio in City Center',
      description: 'A compact and comfortable studio close to everything.',
      imageSrc: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      category: 'apartment',
      roomCount: 1,
      bathroomCount: 1,
      guestCount: 2,
      price: 42,
      country: 'VN',
      region: 'Hanoi',
      latlng: [21, 105],
      userId: SEED_IDS.users.alice,
    },
  });

  const beachHouse = await prisma.listing.upsert({
    where: { id: SEED_IDS.listings.beachHouse },
    update: {
      price: 180,
    },
    create: {
      id: SEED_IDS.listings.beachHouse,
      title: 'Beach House with Ocean View',
      description: 'Relax by the sea with a stunning ocean view.',
      imageSrc: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d97',
      category: 'house',
      roomCount: 3,
      bathroomCount: 2,
      guestCount: 6,
      price: 180,
      country: 'VN',
      region: 'Da Nang',
      latlng: [16, 108],
      userId: SEED_IDS.users.bob,
    },
  });

  return { cozyStudio, beachHouse };
}
