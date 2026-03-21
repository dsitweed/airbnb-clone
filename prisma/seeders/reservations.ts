import { PrismaClient } from '@/lib/generated/prisma/client';

import { SEED_IDS } from './constants';

export async function seedReservations(prisma: PrismaClient) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 7);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 3);

  const reservation = await prisma.reservation.upsert({
    where: { id: SEED_IDS.reservations.aliceStaysAtBeach },
    update: {
      startDate,
      endDate,
      totalPrice: 540,
    },
    create: {
      id: SEED_IDS.reservations.aliceStaysAtBeach,
      startDate,
      endDate,
      totalPrice: 540,
      listingId: SEED_IDS.listings.beachHouse,
      userId: SEED_IDS.users.alice,
    },
  });

  return { reservation };
}
