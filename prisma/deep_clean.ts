import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ log: ['error'] });
async function clean() {
  console.log('Deep cleaning database...');
  await prisma.startupSector.deleteMany({});
  await prisma.startupMilestone.deleteMany({});
  await prisma.startupAward.deleteMany({});
  await prisma.startupClient.deleteMany({});
  await prisma.startupPress.deleteMany({});
  await prisma.startupLocation.deleteMany({});
  await prisma.startupDetail.deleteMany({});
  await prisma.startupFinancial.deleteMany({});
  await prisma.founder.deleteMany({});
  await prisma.fundingRoundInvestor.deleteMany({});
  await prisma.fundingRound.deleteMany({});
  await prisma.socialLink.deleteMany({});
  await prisma.customSection.deleteMany({});
  await prisma.startup.deleteMany({});
  await prisma.blogEngagement.deleteMany({});
  await prisma.blogTag.deleteMany({});
  await prisma.blogContent.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.districtMetadata.deleteMany({});
  await prisma.district.deleteMany({});
  await prisma.sector.deleteMany({});
  await prisma.userProfile.deleteMany({});
  await prisma.userAccount.deleteMany({});
  const counts = await Promise.all([
    prisma.startup.count(),
    prisma.district.count(),
    prisma.sector.count(),
    prisma.blogPost.count(),
    prisma.userAccount.count(),
  ]);
  console.log('Done. Remaining rows:');
  console.log('  startups:', counts[0]);
  console.log('  districts:', counts[1]);
  console.log('  sectors:', counts[2]);
  console.log('  blog posts:', counts[3]);
  console.log('  user accounts:', counts[4]);
  await prisma['']();
}
clean().catch(e => { console.error(e); process.exit(1); });
