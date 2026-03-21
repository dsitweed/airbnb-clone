import { PrismaClient } from '@/lib/generated/prisma/client';

import { SEED_IDS, SEED_META } from './constants';

export async function seedAccounts(prisma: PrismaClient) {
  const aliceAccount = await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: SEED_META.provider,
        providerAccountId: 'alice',
      },
    },
    update: {
      accessToken: 'seed-token-alice',
    },
    create: {
      type: 'oauth',
      provider: SEED_META.provider,
      providerAccountId: 'alice',
      accessToken: 'seed-token-alice',
      userId: SEED_IDS.users.alice,
    },
  });

  return { aliceAccount };
}
