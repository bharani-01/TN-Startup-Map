import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startupsFilePath = path.resolve(__dirname, '../data/startups.ts');
let content = fs.readFileSync(startupsFilePath, 'utf-8');

// Known real domain mappings for accurate logos
const BRAND_LOGOS: Record<string, string> = {
  'stp-agnikul': 'https://logo.clearbit.com/agnikul.in',
  'stp-freshworks': 'https://logo.clearbit.com/freshworks.com',
  'stp-zoho': 'https://logo.clearbit.com/zoho.com',
  'stp-ather-hosur': 'https://logo.clearbit.com/atherenergy.com',
  'stp-guvi': 'https://logo.clearbit.com/guvi.in',
  'stp-detect-tech': 'https://logo.clearbit.com/detecttechnologies.com',
  'stp-mindgrove': 'https://logo.clearbit.com/mindgrovetech.in',
  'stp-appviewx': 'https://logo.clearbit.com/appviewx.com',
  'stp-eplane': 'https://unavatar.io/eplane.ai',
  'stp-nativespecial': 'https://unavatar.io/nativespecial.com',
  'stp-kissflow': 'https://logo.clearbit.com/kissflow.com',
  'stp-chargebee': 'https://logo.clearbit.com/chargebee.com',
  'stp-rapido': 'https://logo.clearbit.com/rapido.bike',
  'stp-uniphore': 'https://logo.clearbit.com/uniphore.com',
  'stp-madstreetden': 'https://logo.clearbit.com/vue.ai',
  'stp-kaleidofin': 'https://logo.clearbit.com/kaleidofin.com',
  'stp-netmeds': 'https://logo.clearbit.com/netmeds.com',
  'stp-waycool': 'https://logo.clearbit.com/waycool.in',
  'stp-aquaexchange': 'https://logo.clearbit.com/aquaexchange.com',
  'stp-galaxeye': 'https://logo.clearbit.com/galaxeye.space',
  'stp-chaikings': 'https://logo.clearbit.com/chaikings.com',
  'stp-tendercuts': 'https://unavatar.io/tendercuts.in',
  'stp-vivriti': 'https://logo.clearbit.com/vivriticapital.com',
  'stp-yali': 'https://unavatar.io/yaliaerospace.com',
  'stp-sarvam': 'https://logo.clearbit.com/sarvam.ai',
  'stp-planys': 'https://logo.clearbit.com/planystech.com',
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

// 2. In programmatic generator, add logoUrl using geometric identicon
if (!content.includes("logoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${slugName}`")) {
  content = content.replace(
    /website:\s*`https:\/\/\${slugName}\.in`,/g,
    `website: \`https://\${slugName}.in\`,\n      logoUrl: \`https://api.dicebear.com/7.x/identicon/svg?seed=\${slugName}&backgroundColor=ffffff\`,`
  );
}

fs.writeFileSync(startupsFilePath, content, 'utf-8');
console.log('Successfully updated startup logo URLs in startups.ts!');
