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
  title,
  user,
}: ListingViewProps) {
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [isLoading, startTransition] = useTransition();

  const dayCount =
    dateRange.from && dateRange.to
      ? differenceInCalendarDays(dateRange.from, dateRange.to)
      : 0;
  const totalPrice = dayCount * price;

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
    <div className="mt-6 grid grid-cols-1 md:grid-cols-7 md:gap-10">
      <div className="order-first mb-10 md:order-last md:col-span-3">
        <ListingReservation
          price={123}
          dateRange={dateRange}
          totalPrice={0}
          onChangeDate={setDateRange}
          onSubmit={onCreateReservation}
          disabledDates={disabledDates}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
