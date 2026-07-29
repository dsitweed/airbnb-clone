'use client';

import CountrySelect from '@/components/inputs/CountrySelect';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatISO } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { useMemo, useState } from 'react';
import { FieldValues, SubmitHandler, useForm, useWatch } from 'react-hook-form';

interface SearchModalProps {
  onCloseModal: () => void;
}

const steps = {
  '0': 'location',
  '1': 'dateRange',
  '2': 'guestCount',
};

enum STEPS {
  LOCALTION = 0,
  DATE = 1,
  INFO = 2,
}

export default function SearchModal({ onCloseModal }: SearchModalProps) {
  const [step, setStep] = useState(STEPS.LOCALTION);
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { handleSubmit, setValue, control, getValues } = useForm<FieldValues>({
    defaultValues: {
      location: null,
      guestCount: 1,
      bathroomCount: 1,
      roomCount: 1,
      dateRange: {
        from: new Date(),
        to: new Date(),
        key: 'selection',
      },
    },
  });

  const location = useWatch({
    control,
    name: 'location',
  });
  const dateRange = useWatch({
    control,
    name: 'dateRange',
  });
  const country = location?.label;
  const isFieldFilled = !!getValues(steps[step]);

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map'), {
        ssr: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [country],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((currentStep) => Math.max(STEPS.LOCALTION, currentStep - 1));
  };

  const onNext = () => {
    setStep((currentStep) => Math.min(STEPS.INFO, currentStep + 1));
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.INFO) return onNext();
    const { guestCount, roomCount, bathroomCount } = data;

    let currentQuery = {};

    if (searchParams) {
      currentQuery = queryString.parse(searchParams.toString());
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedQuery: any = {
      ...currentQuery,
      country: location?.label,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange?.from) {
      updatedQuery.from = formatISO(dateRange.from);
    }
    if (dateRange?.to) {
      updatedQuery.to = formatISO(dateRange.to);
    }

    const queryUrl = queryString.stringifyUrl(
      {
        url: '/',
        query: updatedQuery,
      },
      {
        skipNull: true,
      },
    );

    onCloseModal();
    router.push(queryUrl);
  };

  const body = () => {
    switch (step) {
      case STEPS.DATE:
        return (
          <div className="flex flex-col gap-3">
            <DialogHeader>When do you plan to go?</DialogHeader>
            <DialogDescription>Make sure everyone is free!</DialogDescription>
            <div className="mx-auto h-90 w-full max-w-90 sm:max-w-sm">
              <Calendar
                title="daterange"
                className="w-full rounded-lg border"
                mode="range"
                captionLayout="dropdown"
                disabled={{
                  before: today,
                }}
                selected={dateRange}
                onSelect={(value) => {
                  setCustomValue('dateRange', value);
                }}
              />
            </div>
          </div>
        );
      case STEPS.INFO:
        return (
          <div className="flex flex-col gap-6">
            <DialogHeader>More Information</DialogHeader>
            <DialogDescription>Find your perfect place!</DialogDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="guestCount">Guests</FieldLabel>
                <Input
                  id="guestCount"
                  type="number"
                  placeholder="How many guests do you allow?"
                  defaultValue={1}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="roomCount">Rooms</FieldLabel>
                <Input
                  id="roomCount"
                  type="number"
                  placeholder="How many rooms do you have?"
                  defaultValue={1}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="bathroomCount">Bathrooms</FieldLabel>
                <Input
                  id="bathroomCount"
                  type="number"
                  placeholder="How many bathrooms do you have?"
                  defaultValue={1}
                />
              </Field>
            </FieldGroup>
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-4">
            <DialogHeader>Where is your place located?</DialogHeader>
            <DialogDescription>
              Help guests find you! {country}
            </DialogDescription>
            <CountrySelect
              value={location}
              onChange={(value) => setCustomValue('location', value)}
            />
            <div className="h-60">
              <Map center={location?.latlng} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <form
        className="relative flex h-auto w-full flex-1 flex-col rounded-lg border-0 outline-none focus:outline-none"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative">{body()}</div>
        <div className="flex flex-col gap-2 py-6">
          <div className="flex w-full flex-row items-center gap-4">
            {step !== STEPS.LOCALTION ? (
              <Button type="button" variant="outline" onClick={onBack}>
                Quay lại
              </Button>
            ) : null}
            <Button type="submit" disabled={!isFieldFilled}>
              {step === STEPS.INFO ? 'Tìm kiếm' : 'Tiếp theo'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
