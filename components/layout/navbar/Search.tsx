'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { differenceInDays, formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import { SearchSlash } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import SearchModal from './SearchModal';

export default function Search() {
  const searchParams = useSearchParams();

  const country = searchParams.get('country');
  const startDate = searchParams.get('from');
  const endDate = searchParams.get('to');
  const guestCount = searchParams.get('guestCount');
  const guestLabel = guestCount ? `${guestCount} khách` : 'Thêm khách';

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let diff = differenceInDays(end, start);

      if (diff == 0) {
        diff = 1;
      }

      return formatDistance(endDate, startDate, {
        addSuffix: true,
        locale: vi,
      });
    }

    return 'Lúc nào đó';
  }, [endDate, startDate]);

  return (
    <Dialog>
      <DialogTrigger asChild name="search">
        <Button
          variant="outline"
          className="flex-1 cursor-pointer rounded-full border py-5 shadow-sm transition duration-300 hover:shadow-md sm:flex-none md:w-auto"
        >
          <div className="flex w-full flex-row items-center justify-between">
            <small className="px-6 text-sm font-bold">
              {country ? country : 'Nơi nào đó'}
            </small>
            <small className="hidden flex-1 border-x px-6 text-center text-sm font-bold sm:block">
              {durationLabel}
            </small>
            <div className="flex flex-row items-center pr-2 pl-6 text-sm text-gray-600">
              <small className="hidden text-sm font-normal sm:block">
                {guestLabel}
              </small>
              <div className="bg-route-500 rounded-full p-2 text-white">
                <SearchSlash color="red" />
              </div>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">
            Tìm kiếm chỗ ở, trải nghiệm và địa điểm
          </DialogTitle>
        </DialogHeader>
        <SearchModal onCloseModal={() => console.log(123)} />
      </DialogContent>
    </Dialog>
  );
}
