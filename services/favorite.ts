'use server';

import prisma from '@/lib/prisma';
import { UpdateFavoriteRequest } from '@/types/api';
import { revalidatePath } from 'next/cache';

import { getCurrentUser } from './user';

export const getFavorites = async () => {
  try {
    const user = await getCurrentUser();

    if (!user) return [];
    const data = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        favoriteIds: true,
      },
    });

    return data?.favoriteIds ?? [];
  } catch {
    return [];
  }
};

export const updateFavorite = async ({
  listingId,
  favorite,
}: UpdateFavoriteRequest) => {
  try {
    if (!listingId || typeof listingId !== 'string') {
      throw new Error('Invalid ID');
    }

    const favorites = await getFavorites();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error('Please sign in to favorite the listing!');
    }

    let newFavorites: string[] = [];
    let isFavorite: boolean = false;

    if (!favorite) {
      newFavorites = favorites.filter((id) => id !== listingId);
      isFavorite = false;
    } else {
      if (favorites.includes(listingId)) {
        newFavorites = [...favorites];
      } else {
        newFavorites = [listingId, ...favorites];
      }
      isFavorite = true;
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { favoriteIds: newFavorites },
    });

    revalidatePath('/');
    revalidatePath(`/listings/${listingId}`);
    revalidatePath('/favorites');

    return {
      isFavorite,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getFavoriteListings = async () => {
  try {
    const favoriteIds = await getFavorites();
    return prisma.listing.findMany({
      where: {
        id: {
          in: favoriteIds,
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};
