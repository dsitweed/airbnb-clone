'use client';

import { useRouter } from 'next/navigation';
import { MdKeyboardBackspace } from 'react-icons/md';

import { Button } from './ui/button';

export default function BackButton() {
  const router = useRouter();

  return (
    <Button variant="ghost" className="rounded-full" onClick={router.back}>
      <MdKeyboardBackspace size={18} />
      <span>Back</span>
    </Button>
  );
}
