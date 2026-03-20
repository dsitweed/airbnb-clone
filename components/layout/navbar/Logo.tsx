import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="relative hidden h-[45px] w-[45px] md:block">
      <Image
        src="/images/logo.png"
        alt="logo"
        fill
        sizes="45px"
        priority
        unoptimized
        className="object-cover"
      />
    </Link>
  );
}
