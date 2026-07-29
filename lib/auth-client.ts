import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth`,
});

export const { signIn, signUp, signOut, useSession } = authClient;
