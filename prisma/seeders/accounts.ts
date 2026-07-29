import { PrismaClient } from '@/lib/generated/prisma/client';

import { SEED_IDS, SEED_META } from './constants';

export async function seedAccounts(prisma: PrismaClient) {
  const aliceAccount = await prisma.account.upsert({
    where: {
      providerId_accountId: {
        providerId: SEED_META.provider,
        accountId: 'alice',
      },
    },
    update: {
      accessToken: 'seed-token-alice',
    },
    create: {
      providerId: SEED_META.provider,
      accountId: 'alice',
      accessToken: 'seed-token-alice',
      userId: SEED_IDS.users.alice,
    },
  });

  return { aliceAccount };
}
