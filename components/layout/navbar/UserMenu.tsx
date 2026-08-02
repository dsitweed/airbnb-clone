'use client';

import AuthModal from '@/components/modals/AuthModal';
import ShareYourHomeModal from '@/components/modals/ShareYourHomeModal';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { DEFAULT_AVATAR_URL, menuItems } from '@/utils/constants';
import { User } from 'better-auth';
import Link from 'next/link';
import { useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { toast } from 'sonner';

interface UserMenuProps {
  user: User | undefined;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [dialogType, setDialogType] = useState<
    'share' | 'login' | 'signup' | null
  >(null);

  const handleLogOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.replace('/');
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
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
              onClick={() => setDialogType(user ? 'share' : 'login')}
            >
              {user ? 'Share your home' : 'Login'}
            </Button>
          </DialogTrigger>
          {dialogType === 'share' && (
            <ShareYourHomeModal onCloseModal={() => setDialogType(null)} />
          )}
          {dialogType === 'login' && (
            <AuthModal name="login" onCloseModal={() => setDialogType(null)} />
          )}
          {dialogType === 'signup' && (
            <AuthModal name="signup" onCloseModal={() => setDialogType(null)} />
          )}
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={user ? 'lg' : 'icon-lg'}
              className={cn('rounded-full', user && 'gap-3 px-2')}
            >
              <AiOutlineMenu />
              <div className="hidden md:block">
                {user && (
                  <Avatar>
                    <AvatarImage src={DEFAULT_AVATAR_URL} />
                  </Avatar>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {user ? (
              <>
                <DropdownMenuGroup className="flex flex-col gap-2">
                  {menuItems.map((menuItem) => (
                    <DropdownMenuItem key={menuItem.label}>
                      <Link href={menuItem.path}>{menuItem.label}</Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setDialogType('share')}
                  >
                    Share your home
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogOut}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            ) : (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setDialogType('login')}>
                    Log in
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDialogType('signup')}>
                    Sign up
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
