import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

import { seedAccounts } from './seeders/accounts';
import { SEED_IDS } from './seeders/constants';
import { seedListings } from './seeders/listings';
import { seedReservations } from './seeders/reservations';
import { seedUsers } from './seeders/users';

function createPrismaClient() {
  const adapter = new PrismaPg(
    {
      connectionString: process.env.DATABASE_URL,
    },
    { schema: 'airbnb_new' },
  );
  return new PrismaClient({
    adapter,
  });
}

async function main() {
  const prisma = createPrismaClient();

  try {
    await seedUsers(prisma);
    await seedAccounts(prisma);
    await seedListings(prisma);
    await seedReservations(prisma);

    await prisma.user.update({
      where: { id: SEED_IDS.users.alice },
      data: { favoriteIds: { set: [SEED_IDS.listings.beachHouse] } },
    });

    console.log('✅ Seed completed');
  } catch (error) {
    console.error('❌ Seed failed');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
