import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { PrismaClient, StartupStage, FundingType, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

const csvPath = 'd:\\tn-startups\\tn_startups_5k\\tn_startups_5000.csv';
const sqlOutputPath = path.resolve(process.cwd(), 'prisma', 'seed_5000_startups.sql');

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'startup';
}

function parseSafeDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (
    trimmed.toLowerCase().includes('not') ||
    trimmed.toLowerCase().includes('applicable') ||
    trimmed.toLowerCase().includes('n/a') ||
    trimmed.length < 4
  ) {
    return null;
  }
  const d = new Date(trimmed);
  if (isNaN(d.getTime())) return null;
  return d;
}

function mapFundingStage(stage: string): StartupStage {
  const s = (stage || '').toLowerCase().trim();
  if (s.includes('grant') || s.includes('pre-seed') || s.includes('pre seed')) return StartupStage.PRE_SEED;
  if (s.includes('seed')) return StartupStage.SEED;
  if (s.includes('series a') || s.includes('series-a')) return StartupStage.SERIES_A;
  if (s.includes('series b') || s.includes('series c') || s.includes('growth') || s.includes('series-b')) return StartupStage.SERIES_B_PLUS;
  if (s.includes('acquired') || s.includes('ipo')) return StartupStage.ACQUIRED;
  if (s.includes('bootstrapped')) return StartupStage.BOOTSTRAPPED;
  if (s.includes('idea')) return StartupStage.IDEA;
  return StartupStage.PRE_SEED;
}

function mapFundingType(stage: string, fundingAmount: string): FundingType {
  const s = (stage || '').toLowerCase().trim();
  const f = (fundingAmount || '').toLowerCase().trim();
  if (s.includes('bootstrapped') || f.includes('not publicly') || f.includes('0') || f === '-') return FundingType.BOOTSTRAPPED;
  if (s.includes('angel')) return FundingType.ANGEL;
  if (s.includes('pre-seed')) return FundingType.PRE_SEED;
  if (s.includes('seed')) return FundingType.SEED;
  if (s.includes('series') || s.includes('growth') || s.includes('venture')) return FundingType.VENTURE_FUNDED;
  return FundingType.BOOTSTRAPPED;
}

const SECTOR_METADATA: Record<string, { id: string; slug: string; icon: string; color: string; description: string }> = {
  'IT Services & Consulting': { id: 'sec-it-services', slug: 'it-services', icon: 'Terminal', color: '#64748b', description: 'Enterprise IT solutions, software consulting, and digital transformation services.' },
  'Automotive & EV': { id: 'sec-ev', slug: 'ev', icon: 'Zap', color: '#06b6d4', description: 'Electric vehicles, battery systems, mobility networks, and automotive engineering.' },
  'B2B SaaS & Enterprise Software': { id: 'sec-saas', slug: 'saas', icon: 'Cloud', color: '#3b82f6', description: 'Enterprise & B2B Software as a Service, CRM, and cloud workflow systems.' },
  'IoT & Hardware': { id: 'sec-iot', slug: 'iot', icon: 'Radio', color: '#06b6d4', description: 'Internet of Things, connected sensors, and smart industrial automation.' },
  'HealthTech & MedTech': { id: 'sec-healthtech', slug: 'healthtech', icon: 'Activity', color: '#ef4444', description: 'Digital health, telemedicine, diagnostics, and medical device innovations.' },
  'Biotech & Pharma': { id: 'sec-biotech', slug: 'biotech', icon: 'Dna', color: '#14b8a6', description: 'Biotechnology, pharmaceuticals, genomic research, and lifesciences.' },
  'AgriTech': { id: 'sec-agritech', slug: 'agritech', icon: 'Leaf', color: '#84cc16', description: 'Precision agriculture, drone crop monitoring, agri-biotech, and farmtech.' },
  'Robotics & Automation': { id: 'sec-robotics', slug: 'robotics', icon: 'Bot', color: '#ec4899', description: 'Autonomous robotics, manufacturing automation, and industrial robotic systems.' },
  'FinTech': { id: 'sec-fintech', slug: 'fintech', icon: 'DollarSign', color: '#10b981', description: 'Digital payments, banking tech, lending, and investment platforms.' },
  'CleanTech & Energy': { id: 'sec-climatetech', slug: 'climatetech', icon: 'Sun', color: '#22c55e', description: 'Renewable energy, circular economy, waste management, and sustainability.' },
  'AI & Machine Learning': { id: 'sec-ai', slug: 'ai', icon: 'Brain', color: '#6366f1', description: 'Artificial Intelligence, LLMs, Computer Vision, and Machine Learning platforms.' },
  'FoodTech & Food Processing': { id: 'sec-foodtech', slug: 'foodtech', icon: 'Utensils', color: '#f97316', description: 'Food processing, culinary tech, sustainable food, and food supply chains.' },
  'EdTech': { id: 'sec-edtech', slug: 'edtech', icon: 'GraduationCap', color: '#f59e0b', description: 'Online learning, vernacular upskilling, and education technology.' },
  'Textiles & Fashion': { id: 'sec-textiles', slug: 'textiles', icon: 'Scissors', color: '#a855f7', description: 'Technical textiles, sustainable apparel, smart fabrics, and fashion-tech.' },
  'Aerospace & Defense': { id: 'sec-spacetech', slug: 'spacetech', icon: 'Rocket', color: '#8b5cf6', description: 'Aerospace engineering, satellites, launch vehicles, and defense electronics.' },
  'E-Commerce & Marketplace': { id: 'sec-ecommerce', slug: 'ecommerce', icon: 'ShoppingBag', color: '#eab308', description: 'E-commerce marketplaces, D2C retail platforms, and multi-vendor networks.' },
  'Semiconductor & Electronics': { id: 'sec-deeptech', slug: 'deeptech', icon: 'Cpu', color: '#8b5cf6', description: 'Fabless semiconductor design, VLSI, microcontrollers, and embedded hardware.' },
  'Consumer Internet & D2C': { id: 'sec-consumer', slug: 'consumer', icon: 'Smartphone', color: '#f43f5e', description: 'Direct-to-consumer brands, consumer lifestyle apps, and mobile services.' },
  'Space Technology': { id: 'sec-spacetech', slug: 'spacetech', icon: 'Rocket', color: '#8b5cf6', description: 'Small satellite launchers, 3D rocket engines, and orbital payloads.' },
  'Water & Sanitation': { id: 'sec-climatetech', slug: 'climatetech', icon: 'Droplets', color: '#0ea5e9', description: 'Robotic pipeline inspection, septic cleaning tech, and water conservation.' },
  'Construction & PropTech': { id: 'sec-proptech', slug: 'proptech', icon: 'Home', color: '#78716c', description: 'Property management platforms, smart building systems, and construct-tech.' },
  'Media & Entertainment': { id: 'sec-media', slug: 'media', icon: 'Film', color: '#d946ef', description: 'Digital media, creator tools, animation, and vernacular content streaming.' },
  'Travel & Hospitality': { id: 'sec-travel', slug: 'travel', icon: 'Compass', color: '#0284c7', description: 'Travel booking automation, experiential tourism, and hospitality SaaS.' },
  'Social Impact & GovTech': { id: 'sec-govtech', slug: 'govtech', icon: 'Shield', color: '#059669', description: 'Public governance platforms, rural empowerment, and social impact tech.' },
  'Logistics & Supply Chain': { id: 'sec-logistics', slug: 'logistics', icon: 'Truck', color: '#d97706', description: 'Fleet optimization, cold chain logistics, warehousing, and freight-tech.' },
  'HR Tech & Staffing': { id: 'sec-hrtech', slug: 'hrtech', icon: 'Users', color: '#4f46e5', description: 'Recruitment automation, human capital analytics, and talent sourcing.' },
  'Other': { id: 'sec-other', slug: 'other', icon: 'Box', color: '#6b7280', description: 'Cross-disciplinary innovations and emerging technology verticals.' },
};

function mapCityToDistrict(cityStr: string, allDistricts: any[]) {
  const raw = (cityStr || '').trim();
  const c = raw.toLowerCase();

  let targetSlug = 'coimbatore';
  if (c.includes('chennai')) targetSlug = 'chennai';
  else if (c.includes('chengalpattu') || c.includes('siruseri') || c.includes('mahindra world')) targetSlug = 'chengalpattu';
  else if (c.includes('coimbatore')) targetSlug = 'coimbatore';
  else if (c.includes('madurai')) targetSlug = 'madurai';
  else if (c.includes('tiruchirappalli') || c.includes('trichy')) targetSlug = 'tiruchirappalli';
  else if (c.includes('salem')) targetSlug = 'salem';
  else if (c.includes('tiruppur')) targetSlug = 'tiruppur';
  else if (c.includes('erode')) targetSlug = 'erode';
  else if (c.includes('hosur') || c.includes('krishnagiri')) targetSlug = 'krishnagiri';
  else if (c.includes('vellore')) targetSlug = 'vellore';
  else if (c.includes('thanjavur')) targetSlug = 'thanjavur';
  else if (c.includes('karur')) targetSlug = 'karur';
  else if (c.includes('dindigul')) targetSlug = 'dindigul';
  else if (c.includes('kanyakumari') || c.includes('nagercoil')) targetSlug = 'kanyakumari';
  else if (c.includes('tirunelveli')) targetSlug = 'tirunelveli';
  else if (c.includes('sivaganga')) targetSlug = 'sivaganga';
  else if (c.includes('tirupathur')) targetSlug = 'tirupathur';
  else if (c.includes('perambalur')) targetSlug = 'perambalur';
  else if (c.includes('ramanathapuram')) targetSlug = 'ramanathapuram';
  else if (c.includes('cuddalore')) targetSlug = 'cuddalore';
  else if (c.includes('virudhunagar')) targetSlug = 'virudhunagar';
  else if (c.includes('pudukkottai')) targetSlug = 'pudukkottai';
  else if (c.includes('nagapattinam')) targetSlug = 'nagapattinam';
  else if (c.includes('namakkal')) targetSlug = 'namakkal';
  else if (c.includes('kanchipuram')) targetSlug = 'kanchipuram';
  else if (c.includes('nilgiris') || c.includes('ooty')) targetSlug = 'nilgiris';
  else if (c.includes('thoothukudi') || c.includes('tuticorin')) targetSlug = 'thoothukudi';
  else if (c.includes('dharmapuri')) targetSlug = 'dharmapuri';
  else if (c.includes('tenkasi')) targetSlug = 'tenkasi';
  else if (c.includes('theni')) targetSlug = 'theni';
  else if (c.includes('tiruvarur')) targetSlug = 'tiruvarur';
  else if (c.includes('viluppuram')) targetSlug = 'viluppuram';
  else if (c.includes('kallakurichi')) targetSlug = 'kallakurichi';
  else if (c.includes('mayiladuthurai')) targetSlug = 'mayiladuthurai';
  else if (c.includes('ariyalur')) targetSlug = 'ariyalur';
  else if (c.includes('ranipet')) targetSlug = 'ranipet';
  else if (c.includes('tiruvallur')) targetSlug = 'tiruvallur';
  else if (c.includes('tiruvannamalai')) targetSlug = 'tiruvannamalai';

  const matched = allDistricts.find(d => d.slug === targetSlug || d.id === `dist-${targetSlug}`);
  return matched || allDistricts[0];
}

function escapeSql(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (val instanceof Date) return `'${val.toISOString()}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

function isValidRealDomain(domain: string): boolean {
  if (!domain || domain.length < 4) return false;
  const invalid = [
    'startuptn.in',
    'github.com',
    'linkedin.com',
    'not publicly available',
    'notpubliclyavailable',
    'notavailable',
    'notfound',
    'na',
    'none'
  ];
  return !invalid.some(inv => domain.includes(inv));
}

async function main() {
  console.log('🚀 Turbo SQL Batch Seeder starting...');
  const startTime = Date.now();

  // 1. Ensure all sectors exist
  console.log('1️⃣ Upserting taxonomy sectors...');
  const sectorEntries = Object.entries(SECTOR_METADATA);
  for (let i = 0; i < sectorEntries.length; i++) {
    const [name, meta] = sectorEntries[i];
    await prisma.sector.upsert({
      where: { slug: meta.slug },
      update: {
        name,
        icon: meta.icon,
        color: meta.color,
        description: meta.description,
        isActive: true,
      },
      create: {
        id: meta.id,
        name,
        slug: meta.slug,
        icon: meta.icon,
        color: meta.color,
        description: meta.description,
        displayOrder: i + 1,
        isActive: true,
      }
    });
  }

  const allDistricts = await prisma.district.findMany();
  const allSectors = await prisma.sector.findMany();
  const existingStartups = await prisma.startup.findMany({
    select: { id: true, slug: true, name: true, website: true }
  });

  console.log(`Districts: ${allDistricts.length}, Sectors: ${allSectors.length}, Existing Startups in DB: ${existingStartups.length}`);

  // 2. Read and parse CSV
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  console.log(`Read ${lines.length - 1} records from CSV.`);

  const usedSlugs = new Set(existingStartups.map(s => s.slug));
  const processedNormNames = new Set<string>();

  const allSqlStatements: string[] = [];
  let duplicateCount = 0;
  let newCount = 0;
  let updateCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const name = row[0]?.trim();
    if (!name) continue;

    const rawWebsite = row[1]?.trim() || '';
    const website = (rawWebsite.startsWith('http') ? rawWebsite : (rawWebsite && !rawWebsite.includes('not publicly') ? `https://${rawWebsite}` : 'https://startuptn.in'));
    const city = row[2]?.trim() || 'Tamil Nadu';
    const sectorName = row[3]?.trim() || 'Other';
    const description = row[4]?.trim() || `${name} is an innovative technology enterprise operating from ${city}, Tamil Nadu.`;
    const foundedYear = parseInt(row[5]?.trim(), 10) || 2021;
    const foundersRaw = row[6]?.trim() || '';
    const stageRaw = row[7]?.trim() || 'Seed';
    const totalFunding = row[8]?.trim() || 'Not publicly applicable';
    const lastFundingDate = row[9]?.trim() || null;
    const hiringDetails = row[11]?.trim() || '';
    const teamSize = row[12]?.trim() || '10-50';
    const lastVerified = row[16]?.trim() || '2026-08-24';
    const sourceUrls = row[17]?.trim() || 'https://startuptn.in';

    const normName = normalizeName(name);
    const normDom = normalizeDomain(website);

    if (processedNormNames.has(normName) && normName.length > 2) {
      duplicateCount++;
      continue;
    }
    processedNormNames.add(normName);

    const existing = existingStartups.find(dbS => {
      const dbNormName = normalizeName(dbS.name);
      const dbNormDom = normalizeDomain(dbS.website);
      const nameMatch = normName.length >= 4 && dbNormName === normName;
      const domainMatch = isValidRealDomain(normDom) && isValidRealDomain(dbNormDom) && normDom === dbNormDom;
      return nameMatch || domainMatch;
    });

    const stageEnum = mapFundingStage(stageRaw);
    const fundingTypeEnum = mapFundingType(stageRaw, totalFunding);
    const isHiring = hiringDetails.toLowerCase().includes('hiring') || hiringDetails.toLowerCase().includes('open');

    const matchedDistrict = mapCityToDistrict(city, allDistricts);
    const sectorMeta = SECTOR_METADATA[sectorName] || SECTOR_METADATA['Other'];
    const matchedSector = allSectors.find(s => s.slug === sectorMeta.slug) || allSectors[0];

    const jitterLat = matchedDistrict.latitude + ((crypto.randomBytes(2).readUInt16LE(0) / 65535) - 0.5) * 0.07;
    const jitterLng = matchedDistrict.longitude + ((crypto.randomBytes(2).readUInt16LE(0) / 65535) - 0.5) * 0.07;

    const founderNames = foundersRaw
      .split(/,|&|\band\b/i)
      .map(f => f.trim())
      .filter(f => f.length > 1 && !f.toLowerCase().includes('not publicly') && !f.toLowerCase().includes('applicable'));

    const parsedVerifiedDate = parseSafeDate(lastVerified) || new Date();
    const parsedFundingDate = parseSafeDate(lastFundingDate);

    if (existing) {
      updateCount++;
      const startupId = existing.id;
      allSqlStatements.push(`
        UPDATE startups 
        SET stage = '${stageEnum}', funding_type = '${fundingTypeEnum}', is_hiring = ${isHiring ? 'TRUE' : 'FALSE'}, updated_at = NOW() 
        WHERE id = '${startupId}';
        
        UPDATE startup_details 
        SET source_url = ${escapeSql(sourceUrls)}, last_verified_at = ${escapeSql(parsedVerifiedDate)} 
        WHERE startup_id = '${startupId}';
      `);
    } else {
      newCount++;
      let baseSlug = slugify(name);
      let slug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter++}`;
      }
      usedSlugs.add(slug);

      const startupId = `stp-${slug}`;
      const publicId = `stp_${crypto.randomBytes(8).toString('hex')}`;
      const detailId = `det-${slug}`;
      const locationId = `loc-${slug}`;
      const financialId = `fin-${slug}`;
      const trendingScore = Math.floor(Math.random() * 25) + 70;
      const tagline = description.length > 180 ? `${description.slice(0, 177)}...` : description;

      allSqlStatements.push(`
        INSERT INTO startups (id, public_id, slug, name, tagline, website, stage, funding_type, founded_year, team_size, verification_status, trending_score, is_hiring, created_at, updated_at) 
        VALUES ('${startupId}', '${publicId}', '${slug}', ${escapeSql(name)}, ${escapeSql(tagline)}, ${escapeSql(website)}, '${stageEnum}', '${fundingTypeEnum}', ${foundedYear}, ${escapeSql(teamSize)}, 'VERIFIED', ${trendingScore}, ${isHiring ? 'TRUE' : 'FALSE'}, NOW(), NOW()) 
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO startup_details (id, startup_id, description, extended_bio, brand_color, source, source_url, last_verified_at, updated_at) 
        VALUES ('${detailId}', '${startupId}', ${escapeSql(description)}, ${escapeSql(`${name} is an active venture operating from ${city}, Tamil Nadu specializing in ${sectorName}.`)}, '${sectorMeta.color}', 'Verified Tamil Nadu Ecosystem Dataset', ${escapeSql(sourceUrls)}, ${escapeSql(parsedVerifiedDate)}, NOW()) 
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO startup_locations (id, startup_id, district_id, city, latitude, longitude, updated_at) 
        VALUES ('${locationId}', '${startupId}', '${matchedDistrict.id}', ${escapeSql(city)}, ${jitterLat.toFixed(6)}, ${jitterLng.toFixed(6)}, NOW()) 
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO startup_financials (id, startup_id, total_funding_inr, total_funding_usd, latest_round_type, latest_round_date, last_updated_at) 
        VALUES ('${financialId}', '${startupId}', ${escapeSql(totalFunding.includes('₹') ? totalFunding : null)}, ${escapeSql(totalFunding.includes('$') ? totalFunding : null)}, ${escapeSql(stageRaw)}, ${escapeSql(parsedFundingDate)}, NOW()) 
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO startup_sectors (startup_id, sector_id, is_primary, assigned_at) 
        VALUES ('${startupId}', '${matchedSector.id}', TRUE, NOW()) 
        ON CONFLICT (startup_id, sector_id) DO NOTHING;
      `);

      for (let fIdx = 0; fIdx < founderNames.length; fIdx++) {
        const fndId = `fnd-${slug}-${fIdx + 1}`;
        const fndPubId = `fnd_${crypto.randomBytes(8).toString('hex')}`;
        allSqlStatements.push(`
          INSERT INTO founders (id, public_id, startup_id, name, role_title, display_order, created_at, updated_at) 
          VALUES ('${fndId}', '${fndPubId}', '${startupId}', ${escapeSql(founderNames[fIdx])}, 'Co-Founder', ${fIdx}, NOW(), NOW()) 
          ON CONFLICT (id) DO NOTHING;
        `);
      }
    }
  }

  // 3. Write complete SQL file
  const fullSqlScript = `
    BEGIN;
    ${allSqlStatements.join('\n')}
    COMMIT;
  `;
  fs.writeFileSync(sqlOutputPath, fullSqlScript, 'utf8');
  console.log(`💾 Saved SQL script: ${sqlOutputPath} (${(fs.statSync(sqlOutputPath).size / 1024).toFixed(1)} KB)`);

  // 4. Fast direct SQL execution via pg.Client
  console.log(`⚡ Connecting via pg.Client for direct high-speed execution...`);
  const pg = await import('pg');
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const client = new pg.default.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log(`⚡ Connected to Postgres. Executing complete SQL batch transaction...`);
  await client.query(fullSqlScript);
  await client.end();
  console.log(`⚡ Direct SQL transaction successfully committed!`);

  const finalTotal = await prisma.startup.count();
  const finalLocations = await prisma.startupLocation.count();
  const finalFounders = await prisma.founder.count();
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n======================================================');
  console.log(`🎉 SQL DATABASE SEEDING COMPLETED in ${durationSec}s!`);
  console.log(`- New Startups Inserted: ${newCount}`);
  console.log(`- Existing Startups Updated & Enriched: ${updateCount}`);
  console.log(`- Duplicates filtered: ${duplicateCount}`);
  console.log(`- Total Startups in DB now: ${finalTotal}`);
  console.log(`- Total Geocoded Map Locations: ${finalLocations}`);
  console.log(`- Total Founders Mapped: ${finalFounders}`);
  console.log('======================================================\n');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
