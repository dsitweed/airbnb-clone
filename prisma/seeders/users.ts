import { PrismaClient } from '@/lib/generated/prisma/client';

import { SEED_IDS } from './constants';

export async function seedUsers(prisma: PrismaClient) {
  const alice = await prisma.user.upsert({
    where: { id: SEED_IDS.users.alice },
    update: {
      name: 'Alice',
      image: 'https://i.pravatar.cc/150?img=47',
    },
    create: {
      id: SEED_IDS.users.alice,
      email: 'alice@example.com',
      name: 'Alice',
      emailVerified: false,
      image: 'https://i.pravatar.cc/150?img=47',
      favoriteIds: [],
    },
  });

  const bob = await prisma.user.upsert({
    where: { id: SEED_IDS.users.bob },
    update: {
      name: 'Bob',
      image: 'https://i.pravatar.cc/150?img=12',
    },
    create: {
      id: SEED_IDS.users.bob,
      email: 'bob@example.com',
      name: 'Bob',
      emailVerified: false,
      image: 'https://i.pravatar.cc/150?img=12',
      favoriteIds: [],
    },
  });

  return { alice, bob };
}
