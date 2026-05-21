import { Listing, Prisma } from '@/lib/generated/prisma/client';
import prisma from '@/lib/prisma';
import { GetListingQuery } from '@/types/api';
import { LISTINGS_BATCH } from '@/utils/constants';

import { getCurrentUser } from './user';

export const getListing = async ({
  userId,
  country,
  category,
  cursor,
  roomCount,
  guestCount,
  bathroomCount,
  startDate,
  endDate,
}: GetListingQuery) => {
  try {
    const where: Prisma.ListingWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (category) {
      where.category = category;
    }

    if (roomCount) {
      where.roomCount = {
        gte: roomCount,
      };
    }

    if (guestCount) {
      where.guestCount = {
        gte: guestCount,
      };
    }

    if (bathroomCount) {
      where.bathroomCount = {
        gte: bathroomCount,
      };
    }

    if (country) {
      where.country = country;
    }

    if (startDate && endDate) {
      where.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const filterQuery: Prisma.ListingFindManyArgs = {
      where,
      take: LISTINGS_BATCH,
      orderBy: { createdAt: 'desc' },
    };

    if (cursor) {
      filterQuery.cursor = { id: cursor };
      filterQuery.skip = 1;
    }

    const listings = await prisma.listing.findMany(filterQuery);
    const nextCursor =
      listings.length === LISTINGS_BATCH
        ? listings[LISTINGS_BATCH - 1].id
        : null;

    return {
      listings,
      nextCursor,
    };
  } catch {
    return {
      listings: [],
      nextCursor: null,
    };
  }
};

export const getListingId = async (id: string) => {
  if (!id) {
    return null;
  }

  return prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      reservations: {
        select: {
          startDate: true,
          endDate: true,
        },
      },
    },
  });
};

export const createListing = async (
  data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  Object.values(data).forEach((value) => {
    if (!value) {
      throw new Error('Invalid data');
    }
  });

  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized!');

  return prisma.listing.create({
    data: {
      ...data,
      userId: user.id,
    },
  });
};
