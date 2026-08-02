'use client';

import { createPaymentSession } from '@/services/reservation';
import type { getCurrentUser } from '@/services/user';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

import ListingReservation from './ListingReservation';

interface ListingViewProps {
  reservations?: {
    startDate: Date;
    endDate: Date;
  }[];
  id: string;
  title: string;
  price: number;
  user: Awaited<ReturnType<typeof getCurrentUser>>;
}

const initialDateRange: DateRange = {
  from: new Date(),
  to: new Date(),
};

export default function ListingView({
  reservations,
  price,
  id,
  user,
}: ListingViewProps) {
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [isLoading, startTransition] = useTransition();

  const dayCount =
    dateRange.from && dateRange.to
      ? differenceInCalendarDays(dateRange.from, dateRange.to)
      : 0;
  const totalPrice = (dayCount + 1) * price;

  const router = useRouter();
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    reservations?.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const onCreateReservation = () => {
    if (!user) return toast.error('Please login to reserve listing.');
    startTransition(async () => {
      try {
        const { from, to } = dateRange;

        if (!from || !to) {
          toast.warning('Select from and to day');
          return;
        }

        const res = await createPaymentSession({
          listingId: id,
          endDate: from,
          startDate: to,
          totalPrice,
        });

        if (res?.url) {
          router.push(res.url);
        } else {
          toast.error('Create reservation failed!');
        }
      } catch (error: any) {
        toast.error(error?.message);
      }
    });
  };

  return (
    <ListingReservation
      price={price}
      dateRange={dateRange}
      totalPrice={totalPrice}
      onChangeDate={setDateRange}
      onSubmit={onCreateReservation}
      disabledDates={disabledDates}
      isLoading={isLoading}
    />
  );
}
