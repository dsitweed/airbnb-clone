'use server';

import { Listing, Prisma, Reservation } from '@/lib/generated/prisma/client';
import prisma from '@/lib/prisma';
import { CreatePaymentSessionRequest, GetReservationQuery } from '@/types/api';
import { LISTINGS_BATCH } from '@/utils/constants';
import { revalidatePath } from 'next/cache';

import { getCurrentUser } from './user';

export const getReservations = async ({
  listingId,
  userId,
  authorId,
  cursor,
}: GetReservationQuery) => {
  try {
    const where: Prisma.ReservationWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (listingId) {
      where.listingId = listingId;
    }

    if (authorId) {
      where.listing = {
        userId: authorId,
      };
    }

    const filterQuery: Prisma.ReservationFindManyArgs = {
      where,
      take: LISTINGS_BATCH,
      include: {
        listing: true,
      },
      orderBy: { createdAt: 'desc' },
    };

    if (cursor) {
      filterQuery.cursor = { id: cursor };
      filterQuery.skip = 1;
    }
    const reservations = (await prisma.reservation.findMany({
      ...filterQuery,
    })) as (Reservation & { listing: Listing })[];

    const nextCursor =
      reservations.length === LISTINGS_BATCH
        ? reservations[LISTINGS_BATCH - 1].id
        : null;

    const listings = reservations.map((reservation) => {
      const { id, startDate, endDate, totalPrice, listing } = reservation;

      return {
        ...listing,
        reservation: { id, startDate, endDate, totalPrice },
      };
    });

    return {
      listings,
      nextCursor,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error?.message);
  }
};

export const createReservation = async (
  data: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  try {
    const { listingId, userId, startDate, endDate, totalPrice } = data;
    if (!listingId || !userId || !startDate || !endDate || !totalPrice) {
      throw new Error('Invalid data!');
    }
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        reservations: {
          create: {
            userId,
            startDate,
            endDate,
            totalPrice,
          },
        },
      },
    });

    revalidatePath(`/listings/${listingId}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteReservation = async (reservationId: string) => {
  try {
    if (!reservationId || typeof reservationId !== 'string') {
      throw new Error('Invalid ID');
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error('Unauthorized!');
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new Error('Reservation not found!');
    }

    const result = await prisma.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [
          {
            userId: currentUser.id,
            listing: { userId: currentUser.id },
          },
        ],
      },
    });

    if (result.count > 0) {
      revalidatePath('/reservations');
      revalidatePath(`/listings/${reservation.listingId}`);
      revalidatePath('/trips');
    }

    return reservation;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// FIXME
export const createPaymentSession = async ({
  listingId,
  startDate,
  endDate,
  totalPrice,
}: CreatePaymentSessionRequest) => {
  if (!listingId || !startDate || !endDate || !totalPrice) {
    throw new Error('Invalid data');
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });
  if (!listing) throw new Error('Listing not found!');

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error('Please log in to reserve!');
  }

  return { url: 'fake string' };
};
