import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{2388}\u{23E9}-\u{23FA}\u{231A}\u{231B}]/gu;

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css') || f.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const matches = content.match(emojiRegex);
      if (matches) {
        console.log(`Found emojis in ${fullPath}:`, matches);
      }
    }
  }
}

scanDir(path.resolve(__dirname, '../../../../src'));
