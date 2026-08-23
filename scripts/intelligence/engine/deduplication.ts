export interface DuplicateMatch {
  canonicalName: string;
  duplicateName: string;
  matchType: 'EXACT_DOMAIN' | 'EXACT_NAME' | 'NORMALIZED_NAME_SIMILARITY' | 'FOUNDER_AND_DOMAIN' | 'LEGAL_VS_BRAND';
  similarityScore: number;
  sourcesFound: string[];
}

export function cleanDomain(url?: string | null): string {
  if (!url) return '';
  try {
    let raw = url.trim().toLowerCase();
    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      raw = `https://${raw}`;
    }
    const parsed = new URL(raw);
    let host = parsed.hostname.replace(/^www\./, '');
    return host;
  } catch (e) {
    return (url || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim();
  }
}

export function normalizeCompanyName(name: string): string {
  if (!name) return '';
  let clean = name.toLowerCase().trim();

  // Strip corporate suffixes
  const suffixes = [
    'private limited',
    'pvt ltd',
    'pvt. ltd.',
    'pvt. ltd',
    'pvt',
    'ltd',
    'limited',
    'llp',
    'inc.',
    'inc',
    'technologies',
    'technology',
    'tech',
    'solutions',
    'enterprises',
    'innovations',
    'innovative',
    'systems',
    'services',
    'laboratories',
    'labs',
    'ventures',
    'india',
    'energy',
    'robotics',
    'biosciences',
    'biotech',
    'foods',
  ];

  // Remove punctuation
  clean = clean.replace(/[^a-z0-9\s]/g, ' ');

  // Tokenize and clean
  let words = clean.split(/\s+/).filter(w => w.length > 0);
  words = words.filter(w => !suffixes.includes(w));

  return words.join(' ').trim();
}

export function calculateLevenshteinSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1.0;

  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  const matrix: number[][] = [];
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  const distance = matrix[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return 1 - distance / maxLen;
}
