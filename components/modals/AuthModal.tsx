import { signIn, signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { FaGithub, FaGoogle, FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';

import Heading from '../Heading';
import { Button } from '../ui/button';
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Field, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

interface AuthModalProps {
  name: 'login' | 'signup';
  onCloseModal: () => void;
}

export default function AuthModal({ name, onCloseModal }: AuthModalProps) {
  const [isLoading, startTransition] = useTransition();
  const [isLoginModal, setIsLoginModal] = useState(name === 'login');

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    setFocus,
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoginModal) {
        setFocus('email');
      } else {
        setFocus('name');
      }
    });

    return () => clearTimeout(timer);
  }, [isLoginModal, setFocus]);

  const onToggle = () => {
    setIsLoginModal((prev) => !prev);
    reset();
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const { email, password, name } = data;

    startTransition(async () => {
      try {
        if (isLoginModal) {
          const callback = await signIn.email({
            email,
            password,
            rememberMe: true,
            callbackURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
          });

          if (callback.error) {
            throw new Error(callback.error.message);
          }

          if (callback.data) {
            toast.success("You're successfully logged in.");
            onCloseModal();
            router.refresh();
          }
        } else {
          const callback = await signUp.email({
            name,
            email,
            password,
          });

          if (callback.error) {
            throw new Error(callback.error.message);
          }

          if (callback.data) {
            toast.success('Account created successfully.');
            onCloseModal();
            router.refresh();
          }
        }
      } catch (error: any) {
        toast.error(error.message);
        if (isLoginModal) {
          reset();
          setError('email', {});
          setError('password', {});
          setTimeout(() => {
            setFocus('email');
          }, 100);
        }
      }
    });
  };

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle className="text-center">
          {isLoginModal ? 'Login' : 'Sign Up'}
        </DialogTitle>
      </DialogHeader>
      <form
        className="flex h-full w-full flex-col gap-5 p-6 pb-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading
          title={isLoginModal ? 'Welcome back' : 'Welcome to Airbnb'}
          subTitle={
            isLoginModal ? 'Login to your account' : 'Create an account'
          }
        />
        {!isLoginModal && (
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              aria-label="name"
              type="text"
              disabled={isLoading}
              required
              {...register('name', {
                required: 'Name is required!',
              })}
            />
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            aria-label="email"
            type="email"
            disabled={isLoading}
            required
            {...register('email', {
              required: 'Email is required!',
            })}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            aria-label="password"
            type="password"
            disabled={isLoading}
            required
            {...register('password', {
              required: 'Password is required!',
            })}
          />
        </Field>
        <DialogFooter>
          <Button type="submit">
            {isLoading ? <FaSpinner className="animate-spin" /> : 'Continue'}
          </Button>
        </DialogFooter>
      </form>
      <div className="mt-3 flex flex-col gap-4 p-6 pt-0">
        <Button
          variant="outline"
          className="flex flex-row items-center justify-center gap-2 px-3 py-2"
          onClick={() =>
            signIn.social({
              provider: 'google',
            })
          }
        >
          <FaGoogle className="h-6 w-6" />
          <span className="text-sm">Continue with Google</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-row items-center justify-center gap-2 px-3 py-2"
          onClick={() =>
            signIn.social({
              provider: 'github',
            })
          }
        >
          <FaGithub className="h-6 w-6" />
          <span className="text-sm">Continue with Github</span>
        </Button>
        <div className="mt-2 text-center font-light text-neutral-500">
          <small className="text-base">
            {isLoginModal
              ? 'Already have an account?'
              : 'First time using Airbnb?'}
          </small>
          <Button
            type="button"
            onClick={onToggle}
            className="ml-1 cursor-pointer font-medium hover:underline"
          >
            {isLoginModal ? 'Create an account' : 'Login'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
