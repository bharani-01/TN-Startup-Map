import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startupsFilePath = path.resolve(__dirname, '../data/startups.ts');
let content = fs.readFileSync(startupsFilePath, 'utf-8');

// Regex to find website entries and add/update logoUrl
// Let's inspect the startups in startups.ts
const websiteMatches = [...content.matchAll(/name:\s*['"]([^'"]+)['"][\s\S]*?website:\s*['"]([^'"]+)['"]/g)];

console.log(`Found ${websiteMatches.length} startups with websites.`);
websiteMatches.slice(0, 10).forEach(m => {
  console.log(`- ${m[1]}: ${m[2]}`);
});
