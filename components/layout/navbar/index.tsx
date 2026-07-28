import { getCurrentUser } from '@/services/user';
import { Suspense } from 'react';

import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NavBarProps {}

export default async function NavBar(props: NavBarProps) {
  const user = await getCurrentUser();

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white">
      <nav className="border-b py-3">
        <div className="main-container flex flex-row items-center justify-between gap-3 md:gap-0">
          <Logo />
          <Suspense fallback={<></>}>
            <Search />
          </Suspense>
          <UserMenu user={user} />
        </div>
      </nav>
      {/* Categories */}
    </header>
  );
}
