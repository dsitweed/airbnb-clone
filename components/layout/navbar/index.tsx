import { Suspense } from 'react';

import Logo from './Logo';
import Search from './Search';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NavBarProps {}

export default async function NavBar(props: NavBarProps) {
  const user = {
    id: '123',
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white">
      <nav className="border-b py-3">
        <div className="container flex flex-row items-center justify-between gap-3 md:gap-0">
          <Logo />
          <Suspense fallback={<></>}>
            <Search />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
