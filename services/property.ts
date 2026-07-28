'use server';

import { Prisma } from '@/lib/generated/prisma/client';
import prisma from '@/lib/prisma';
import { GetPropertyQuery } from '@/types/api';
import { LISTINGS_BATCH } from '@/utils/constants';
import { revalidatePath } from 'next/cache';

import { getCurrentUser } from './user';

export const getProperties = async ({ userId, cursor }: GetPropertyQuery) => {
  try {
    if (!userId) {
      throw new Error('Unauthorized!');
    }

    const filterQuery: Prisma.ListingFindManyArgs = {
      where: {
        userId,
      },
      take: LISTINGS_BATCH,
      orderBy: { createdAt: 'desc' },
    };

    if (cursor) {
      filterQuery.cursor = { id: cursor };
      filterQuery.skip = 1;
    }

    const properties = await prisma.listing.findMany({
      ...filterQuery,
    });

    const nextCursor =
      properties.length === LISTINGS_BATCH
        ? properties[LISTINGS_BATCH - 1].id
        : null;

    return {
      listings: properties,
      nextCursor,
    };
  } catch {
    return {
      listings: [],
      nextCursor: null,
    };
  }
};

export const deleteProperty = async (listingId: string) => {
  try {
    if (!listingId || typeof listingId !== 'string') {
      throw new Error('Invalid ID');
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Unauthorized!');
    }

    const result = await prisma.listing.deleteMany({
      where: {
        id: listingId,
        userId: currentUser.id,
      },
    });

    if (result.count > 0) {
      revalidatePath('/');
      revalidatePath('/reservation');
      revalidatePath('/trips');
      revalidatePath('/favorites');
      revalidatePath('/properties');
      revalidatePath(`/listings/${listingId}`);
    }

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
