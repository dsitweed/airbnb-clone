'use client';

import { useSession } from '@/lib/auth-client';
import { cn, debounce } from '@/lib/utils';
import { updateFavorite } from '@/services/favorite';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { toast } from 'sonner';

interface HeartButtonProps {
  listingId: string;
  isFavorite: boolean;
}

export default function HeartButton({
  listingId,
  isFavorite: initialValue,
}: HeartButtonProps) {
  const { data } = useSession();
  const [isFavorite, setIsFavorite] = useState(initialValue);
  const isFavoriteRef = useRef(initialValue);
  const { mutate } = useMutation({
    mutationFn: updateFavorite,
    onError: () => {
      isFavoriteRef.current = !isFavoriteRef.current;
      setIsFavorite(isFavoriteRef.current);
      toast.error('Failed to favorite');
    },
  });

  const debouncedUpdateFavorite = debounce((favorite: boolean) => {
    mutate({
      listingId,
      favorite,
    });
  }, 300);

  const handleClick = () => {
    if (!data?.user) {
      toast.error('Please sign in to favorite the listing!');
      return;
    }

    debouncedUpdateFavorite(!isFavoriteRef.current);
    isFavoriteRef.current = !isFavoriteRef.current;
    setIsFavorite((prev) => !prev);
  };

  return (
    <button
      className="relative z-10 cursor-pointer transition hover:opacity-80"
      onClick={handleClick}
    >
      <AiOutlineHeart
        size={28}
        className="absolute -top-0.5 -right-0.5 text-gray-50"
      />
      <AiFillHeart
        size={24}
        className={cn(isFavorite ? 'fill-rose-500' : 'fill-neutral-600')}
      />
    </button>
  );
}
