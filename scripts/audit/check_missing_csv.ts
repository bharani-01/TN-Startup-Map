import fs from 'fs';
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

async function check() {
  const startups = await prisma.startup.findMany({
    select: { id: true, name: true, slug: true }
  });

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);

  const missing: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const name = row[0]?.trim();
    if (!name) continue;

    const normName = normalizeName(name);
    const found = startups.find(s => normalizeName(s.name) === normName);
    if (!found) {
      missing.push({ row: i, name, city: row[2], sector: row[3] });
    }
  }

  console.log(`Total CSV: ${lines.length - 1}`);
  console.log(`Total in DB: ${startups.length}`);
  console.log(`Missing in DB: ${missing.length}`);
  if (missing.length > 0) {
    console.log('Sample missing (first 20):', missing.slice(0, 20));
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
