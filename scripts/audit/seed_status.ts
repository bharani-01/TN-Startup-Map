import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const startups = await prisma.startup.count();
  const locations = await prisma.startupLocation.count();
  const details = await prisma.startupDetail.count();
  const financials = await prisma.startupFinancial.count();
  const sectorsCount = await prisma.startupSector.count();
  const founders = await prisma.founder.count();
  const districts = await prisma.district.count();
  const sectors = await prisma.sector.count();
  const stories = await prisma.blogPost.count();
  const milestones = await prisma.startupMilestone.count();
  const awards = await prisma.startupAward.count();

  const nullLocs = await prisma.startupLocation.count({
    where: { OR: [{ latitude: 0 }, { longitude: 0 }, { districtId: null }] }
  });

  const unlinkedStartups = await prisma.startup.count({
    where: { location: null }
  });

  const stageBreakdown = await prisma.startup.groupBy({
    by: ['stage'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } }
  });

  const fundingTypeBreakdown = await prisma.startup.groupBy({
    by: ['fundingType'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } }
  });

  const topCities = await prisma.startupLocation.groupBy({
    by: ['city'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 15
  });

  const topSectors = await prisma.startupSector.groupBy({
    by: ['sectorId'],
    _count: { startupId: true },
    orderBy: { _count: { startupId: 'desc' } },
    take: 10
  });

  const sectorNames = await prisma.sector.findMany({
    where: { id: { in: topSectors.map(s => s.sectorId) } }
  });
  const sectorNameMap = new Map(sectorNames.map(s => [s.id, s.name]));

  const sampleRecent = await prisma.startup.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      location: { include: { district: true } },
      sectors: { include: { sector: true } },
      financials: true,
      founders: true
    }
  });

  console.log(JSON.stringify({
    summary: {
      totalStartups: startups,
      locationsMappped: locations,
      detailsRecords: details,
      financialRecords: financials,
      sectorLinks: sectorsCount,
      foundersRegistered: founders,
      totalDistricts: districts,
      totalTaxonomySectors: sectors,
      blogStories: stories,
      milestones,
      awards,
      integrityCheck: {
        unlinkedLocations: unlinkedStartups,
        invalidOrZeroCoordinates: nullLocs,
        status: unlinkedStartups === 0 && nullLocs === 0 ? 'HEALTHY_AND_COMPLETE' : 'NEEDS_ATTENTION'
      }
    },
    stages: stageBreakdown.map(s => ({ stage: s.stage, count: s._count.id })),
    fundingTypes: fundingTypeBreakdown.map(f => ({ type: f.fundingType, count: f._count.id })),
    topCities: topCities.map(c => ({ city: c.city, count: c._count.id })),
    topSectors: topSectors.map(s => ({ sector: sectorNameMap.get(s.sectorId) || s.sectorId, count: s._count.startupId })),
    sampleStartups: sampleRecent.map(s => ({
      name: s.name,
      slug: s.slug,
      city: s.location?.city,
      district: s.location?.district?.name,
      coordinates: `${s.location?.latitude?.toFixed(4)}, ${s.location?.longitude?.toFixed(4)}`,
      sector: s.sectors.map(sec => sec.sector.name).join(', '),
      stage: s.stage,
      funding: s.financials?.totalFundingUsd || s.financials?.totalFundingInr || 'Bootstrapped / Grant',
      founders: s.founders.map(f => f.name).slice(0, 2).join(', ')
    }))
  }, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
