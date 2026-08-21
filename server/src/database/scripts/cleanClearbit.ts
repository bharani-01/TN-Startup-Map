import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.resolve(__dirname, '../data/startups.ts');
let content = fs.readFileSync(file, 'utf-8');

// Filter lines that contain clearbit
const lines = content.split('\n');
const cleaned = lines.filter(l => !l.includes('logo.clearbit.com'));
fs.writeFileSync(file, cleaned.join('\n'), 'utf-8');
console.log('✅ Cleaned all clearbit lines');
