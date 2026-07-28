'use client';

import LoginModal from '@/components/modals/LoginModal';
import ShareYourHomeModal from '@/components/modals/ShareYourHomeModal';
import SignupModal from '@/components/modals/SignupModal';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { menuItems } from '@/utils/constants';
import { User } from 'better-auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';

interface UserMenuProps {
  user: User | undefined;
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [dialogType, setDialogType] = useState<
    'share' | 'login' | 'signup' | null
  >(null);

  const redirect = (url: string) => {
    router.push(url);
  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <Dialog
          open={dialogType !== null}
          onOpenChange={(open) => !open && setDialogType(null)}
        >
          <DialogTrigger asChild name="share">
            <Button
              variant="ghost"
              onClick={() => setDialogType(!user ? 'share' : 'login')}
            >
              {user ? 'Share your home' : 'Login'}
            </Button>
          </DialogTrigger>
          {dialogType === 'share' && (
            <ShareYourHomeModal
              onCloseModal={() => console.log('close modal')}
            />
          )}
          {dialogType === 'login' && <LoginModal />}
          {dialogType === 'signup' && <SignupModal />}
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="rounded-full">
              <AiOutlineMenu />
              <div className="hidden md:block">
                <Avatar>
                  <AvatarImage
                    src={
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNupSKjnCIs8Z8mbmI3Nm1Huhj_wEEm-BQo522KiZjAg&s=10'
                    }
                  />
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {!user ? (
              <>
                <DropdownMenuGroup className="flex flex-col gap-2">
                  {menuItems.map((menuItem) => (
                    <DropdownMenuItem key={menuItem.label}>
                      <Link href={menuItem.path}>{menuItem.label}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem>Share your home</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            ) : (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem>Log in</DropdownMenuItem>
                  <DropdownMenuItem>sign up</DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
