import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const csvPath = 'd:\\tn-startups\\tn_startups_5k\\tn_startups_5000.csv';

function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function normalizeName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/private limited|pvt\.?\s*ltd\.?|llp|technologies|solutions|labs|inc\.?/gi, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function normalizeDomain(url: string): string {
  if (!url) return '';
  try {
    let clean = url.toLowerCase().replace(/https?:\/\//, '').replace(/www\./, '').split('/')[0].split('?')[0];
    return clean;
  } catch {
    return url.toLowerCase();
  }
}

async function analyze() {
  console.log('=== Step 1: Checking CSV internal duplicates ===');
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  
  const csvRecords: any[] = [];
  const nameMap = new Map<string, any>();
  const domainMap = new Map<string, any>();
  const internalDupes: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const name = row[0];
    const website = row[1];
    const city = row[2];
    const sector = row[3];
    const description = row[4];
    const foundedYear = row[5];
    const founders = row[6];
    const stage = row[7];
    const totalFunding = row[8];
    const lastFundingDate = row[9];
    const keyProducts = row[10];
    const hiring = row[11];
    const teamSize = row[12];
    const contactEmail = row[13];
    const linkedin = row[14];
    const status = row[15];
    const sourceUrls = row[17];

    const normName = normalizeName(name);
    const normDom = normalizeDomain(website);

    const record = {
      rowIndex: i,
      name,
      website,
      city,
      sector,
      description,
      foundedYear,
      founders,
      stage,
      totalFunding,
      lastFundingDate,
      keyProducts,
      hiring,
      teamSize,
      contactEmail,
      linkedin,
      status,
      sourceUrls,
      normName,
      normDom
    };

    const invalidWebsites = ['not publicly available', 'not available', 'n/a', 'none', '', 'http://', 'https://'];
    const isValidDom = normDom && !invalidWebsites.includes(normDom) && !invalidWebsites.includes(website.toLowerCase()) && !normDom.includes('notfound') && normDom.length > 3;

    if (nameMap.has(normName) && normName.length > 2) {
      internalDupes.push({
        type: 'NAME_DUPLICATE',
        first: nameMap.get(normName).name,
        duplicate: name,
        row: i
      });
    } else {
      nameMap.set(normName, record);
    }

    if (isValidDom && domainMap.has(normDom)) {
      internalDupes.push({
        type: 'DOMAIN_DUPLICATE',
        first: domainMap.get(normDom).name,
        duplicate: name,
        domain: normDom,
        row: i
      });
    } else if (isValidDom) {
      domainMap.set(normDom, record);
    }

    csvRecords.push(record);
  }

  console.log(`Total CSV records: ${csvRecords.length}`);
  console.log(`Internal duplicate entries detected: ${internalDupes.length}`);
  if (internalDupes.length > 0) {
    console.log('Sample internal dupes:', JSON.stringify(internalDupes.slice(0, 10), null, 2));
  }

  console.log('\n=== Step 2: Checking against Existing Database ===');
  const existingDbStartups = await prisma.startup.findMany({
    include: {
      location: true,
      financials: true,
      sectors: { include: { sector: true } },
      founders: true,
      details: true
    }
  });
  console.log(`Existing DB startups count: ${existingDbStartups.length}`);

  const crossDupes: any[] = [];
  for (const record of csvRecords) {
    const matched = existingDbStartups.find(dbS => {
      const dbNormName = normalizeName(dbS.name);
      const dbNormDom = normalizeDomain(dbS.website);
      return (dbNormName === record.normName && record.normName.length > 2) ||
             (record.normDom && dbNormDom && record.normDom === dbNormDom);
    });

    if (matched) {
      crossDupes.push({
        csvName: record.name,
        dbName: matched.name,
        dbId: matched.id,
        dbPublicId: matched.publicId,
        website: record.website
      });
    }
  }

  console.log(`Overlap / Existing Startups in DB found: ${crossDupes.length}`);
  console.log('Sample matched records:', JSON.stringify(crossDupes.slice(0, 15), null, 2));

  console.log('\n=== Summary of Seeding Impact ===');
  console.log(`Unique New CSV startups to insert: ${csvRecords.length - crossDupes.length}`);
  console.log(`Existing DB startups to enrich/update: ${crossDupes.length}`);
  console.log(`Total active startups in platform after seed: ${existingDbStartups.length + (csvRecords.length - crossDupes.length)}`);
}

analyze()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
