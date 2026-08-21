import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startupsFilePath = path.resolve(__dirname, '../data/startups.ts');
let content = fs.readFileSync(startupsFilePath, 'utf-8');

const gFavicon = (domain: string) => `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;

// Known real domain mappings for accurate logos
const BRAND_LOGOS: Record<string, string> = {
  'stp-agnikul': gFavicon('agnikul.in'),
  'stp-freshworks': gFavicon('freshworks.com'),
  'stp-zoho': gFavicon('zoho.com'),
  'stp-ather-hosur': gFavicon('atherenergy.com'),
  'stp-guvi': gFavicon('guvi.in'),
  'stp-detect-tech': gFavicon('detecttechnologies.com'),
  'stp-mindgrove': gFavicon('mindgrovetech.in'),
  'stp-appviewx': gFavicon('appviewx.com'),
  'stp-eplane': 'https://unavatar.io/eplane.ai',
  'stp-nativespecial': 'https://unavatar.io/nativespecial.com',
  'stp-kissflow': gFavicon('kissflow.com'),
  'stp-chargebee': gFavicon('chargebee.com'),
  'stp-rapido': gFavicon('rapido.bike'),
  'stp-uniphore': gFavicon('uniphore.com'),
  'stp-madstreetden': gFavicon('vue.ai'),
  'stp-kaleidofin': gFavicon('kaleidofin.com'),
  'stp-netmeds': gFavicon('netmeds.com'),
  'stp-waycool': gFavicon('waycool.in'),
  'stp-aquaexchange': gFavicon('aquaexchange.com'),
  'stp-galaxeye': gFavicon('galaxeye.space'),
  'stp-chaikings': gFavicon('chaikings.com'),
  'stp-tendercuts': 'https://unavatar.io/tendercuts.in',
  'stp-vivriti': gFavicon('vivriticapital.com'),
  'stp-yali': 'https://unavatar.io/yaliaerospace.com',
  'stp-sarvam': gFavicon('sarvam.ai'),
  'stp-planys': gFavicon('planystech.com'),
};

// 1. Update named startups with direct logoUrl
Object.entries(BRAND_LOGOS).forEach(([id, logoUrl]) => {
  const idRegex = new RegExp(`id:\\s*['"]${id}['"][\\s\\S]*?website:\\s*['"]([^'"]+)['"]`, 'g');
  content = content.replace(idRegex, (match, website) => {
    if (!match.includes('logoUrl:')) {
      return match.replace(`website: '${website}'`, `website: '${website}',\n    logoUrl: '${logoUrl}'`);
    } else {
      return match.replace(/logoUrl:\s*['"][^'"]*['"]/, `logoUrl: '${logoUrl}'`);
    }
  });
});

fs.writeFileSync(startupsFilePath, content, 'utf-8');
console.log('✅ Applied reliable Google Favicon CDN logos to all startups');
