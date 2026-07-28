'use client';

import { createListing } from '@/services/listing';
import { categories } from '@/utils/constants';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';

import Heading from '../Heading';
import CategoryButton from '../inputs/CategoryButton';
import Counter from '../inputs/Counter';
import CountrySelect, { CountrySelectValue } from '../inputs/CountrySelect';
import { Button } from '../ui/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';

interface ShareYourHomeModalProps {
  onCloseModal: () => void;
}

const steps = {
  '0': 'category',
  '1': 'location',
  '2': 'guestCount',
  '3': 'image',
  '4': 'title',
  '5': 'price',
};

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

export default function ShareYourHomeModal({
  onCloseModal,
}: ShareYourHomeModalProps) {
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      category: 'Beach',
      location: null,
      guestCount: 1,
      bathroomCount: 1,
      roomCount: 1,
      image: '',
      price: '',
      title: '',
      description: '',
    },
  });

  const location = watch('location');
  const country = watch(location?.label);

  const Map = useMemo(
    () =>
      dynamic(() => import('../Map'), {
        ssr: false,
      }),
    [country],
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) return onNext();

    startTransition(async () => {
      try {
        const newListing = await createListing(data);
        toast.success(`${data.title} added successfully`);
        queryClient.invalidateQueries({
          queryKey: ['listings'],
        });
        reset();
        setStep(STEPS.CATEGORY);
        onCloseModal();
        router.refresh();
        router.push(`/listings/${newListing.id}`);
      } catch (error: any) {
        toast.error('Failed to create listing!');
        console.log(error?.message);
      }
    });
  };

  const body = () => {
    switch (step) {
      case STEPS.LOCATION:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Where is your place located?"
              subTitle="Help guests find you!"
            />
            <CountrySelect
              value={location}
              onChange={(value: CountrySelectValue) =>
                setCustomValue('location', value)
              }
            />
            <div className="h-60">
              <Map center={location?.latlng} />
            </div>
          </div>
        );
      case STEPS.INFO:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Share some basics about your place"
              subTitle="What amenities do you have"
            />
            <Counter
              title="Guests"
              subtitle="How many guests do you allow"
              onChange={setCustomValue}
              name="guestCount"
              watch={watch}
            />
            <hr />
            <Counter
              title="Rooms"
              subtitle="How many rooms do you have?"
              onChange={setCustomValue}
              name="roomCount"
              watch={watch}
            />
            <hr />
            <Counter
              title="Bathrooms"
              subtitle="How many bathrooms do you have?"
              onChange={setCustomValue}
              name="bathroomCount"
              watch={watch}
            />
          </div>
        );
      case STEPS.IMAGES:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Add a photo of you place"
              subTitle="Show guests what your place looks like!"
            />
            {/* <ImageUpload /> */}
          </div>
        );
      case STEPS.DESCRIPTION:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="How would you describe your place?"
              subTitle="Short and sweet works best!"
            />
            <Input
              id="title"
              aria-label="Title"
              disabled={isLoading}
              required
              autoFocus
            />
            <br />
            <Input
              id="description"
              aria-label="Description"
              disabled={isLoading}
              required
              autoFocus
            />
          </div>
        );
      case STEPS.PRICE:
        return (
          <div className="flex flex-col gap-6">
            <Heading
              title="Now, set your price"
              subTitle="How much do you charge per night?"
            />
            <Input
              key="price"
              id="price"
              aria-label="Price"
              disabled={isLoading}
              required
              autoFocus
            />
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-2">
            <Heading
              title="Which of these best describe your place?"
              subTitle="Pick a category"
            />
            <div className="grid max-h-[60vh] flex-1 grid-cols-2 gap-3 overflow-y-scroll scroll-smooth lg:max-h-65">
              {categories.map((category) => (
                <CategoryButton
                  key={category.label}
                  onClick={() => setCustomValue('category', category.label)}
                  watch={watch}
                  label={category.label}
                  icon={category.icon}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  const isFieldFilled = !!getValues(steps[step]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-center">Share your home</DialogTitle>
      </DialogHeader>
      <form
        className="relative flex w-full flex-1 flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none md:h-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative p-6">{body()}</div>
      </form>
      <DialogFooter className="flex flex-col gap-2 px-6 pt-3 pb-6">
        <div className="flex w-full flex-row items-center gap-4">
          {step !== STEPS.CATEGORY ? (
            <Button
              type="button"
              className="flex items-center justify-center gap-2"
              onClick={onBack}
            >
              Back
            </Button>
          ) : null}
          <Button>
            {isLoading ? (
              <FaSpinner />
            ) : step === STEPS.PRICE ? (
              'Create'
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
