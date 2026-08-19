import { PrismaClient } from '@prisma/client';
import { INITIAL_STARTUPS } from '../data/startups.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to Prisma/PostgreSQL to update logos...');
  try {
    await prisma.$connect();
    console.log('Connected to database. Updating startup records...');

    let updatedCount = 0;
    for (const st of INITIAL_STARTUPS) {
      if (st.logoUrl) {
        try {
          await prisma.startup.updateMany({
            where: {
              OR: [
                { id: st.id },
                { slug: st.slug }
              ]
            },
            data: {
              logoUrl: st.logoUrl
            }
          });
          updatedCount++;
        } catch (e: any) {
          console.warn(`Could not update DB for ${st.name}:`, e.message);
        }
      }
    }

    console.log(`Successfully updated ${updatedCount} startup logos in database!`);
  } catch (err: any) {
    console.log('Prisma not connected or in-memory fallback active:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
