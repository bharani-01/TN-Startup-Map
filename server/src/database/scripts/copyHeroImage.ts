import fs from 'fs';
import path from 'path';

const src = 'C:/Users/bhara/.gemini/antigravity-ide/brain/82b09b6d-f229-44e4-b4c4-b597bcc5456a/.user_uploaded/media_1787176644465.png';
const dest = 'E:/tnstartupmap/public/tn-skyline-hero.png';

fs.copyFileSync(src, dest);
console.log('Successfully copied skyline image to', dest);
