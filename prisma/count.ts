import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const startups = await prisma.startup.count();
  const districts = await prisma.district.count();
  const sectors = await prisma.sector.count();
  const stories = await prisma.blogPost.count();
  const founders = await prisma.founder.count();
  const milestones = await prisma.startupMilestone.count();
  const awards = await prisma.startupAward.count();

  console.log(JSON.stringify({
    startups,
    districts,
    sectors,
    stories,
    founders,
    milestones,
    awards,
  }, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
