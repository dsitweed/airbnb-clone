import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { formatPrice } from '@/lib/utils';
import { isSameDay, startOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { FaSpinner } from 'react-icons/fa';

interface ListingReservationProps {
  price: number;
  dateRange: DateRange;
  totalPrice: number;
  onChangeDate: (dateRange: DateRange) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  disabledDates: Date[];
}

export default function ListingReservation({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabledDates,
  isLoading,
}: ListingReservationProps) {
  const today = startOfDay(new Date());

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex flex-row items-center gap-1 p-4">
        <span className="text-lg font-semibold">{formatPrice(price)}</span>
        <span className="font-light text-neutral-600">night</span>
      </div>
      <Calendar
        title="daterange"
        className="w-full rounded-lg border"
        mode="range"
        captionLayout="dropdown"
        disabled={[
          {
            before: today,
          },
          (date) => disabledDates.some((item) => isSameDay(item, date)),
        ]}
        selected={dateRange}
        onSelect={(value) => {
          onChangeDate(value ? value : dateRange);
        }}
      />
      <div className="p-4">
        <Button
          disabled={isLoading}
          className="flex h-10 w-full flex-row items-center justify-center"
          size="lg"
          onClick={onSubmit}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <span>Reserve</span>
          )}
        </Button>
      </div>
      <div className="flex flex-row items-center justify-between p-4 text-lg font-semibold">
        <span>Total</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>
    </div>
  );
}
