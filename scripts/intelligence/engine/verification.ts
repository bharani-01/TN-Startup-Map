export interface SourceRecord {
  field?: string;
  source_name: string;
  source_type: 'GOVERNMENT' | 'INCUBATOR' | 'UNIVERSITY_TBI' | 'ANGEL_VC' | 'OFFICIAL_WEBSITE' | 'SECONDARY_DATABASE' | 'NEWS_ANNOUNCEMENT';
  source_url: string;
  source_date?: string;
  verified: boolean;
}

export interface VerificationResult {
  level: 0 | 1 | 2 | 3;
  confidence_score: number;
  last_verified: string;
  sources: SourceRecord[];
}

export function calculateVerification(
  sources: SourceRecord[],
  website?: string | null,
  isStartupTnRegistered?: boolean | null,
  isDpiitRecognized?: boolean | null,
  hasFounders?: boolean,
  hasFunding?: boolean
): VerificationResult {
  let score = 0;
  const nowStr = new Date().toISOString();

  // 1. Source Authority (up to 35 points)
  let maxAuthority = 0;
  for (const s of sources) {
    if (s.source_type === 'GOVERNMENT' || s.source_name.toLowerCase().includes('startuptn') || s.source_name.toLowerCase().includes('dpiit')) {
      maxAuthority = Math.max(maxAuthority, 35);
    } else if (s.source_type === 'INCUBATOR' || s.source_type === 'UNIVERSITY_TBI') {
      maxAuthority = Math.max(maxAuthority, 30);
    } else if (s.source_type === 'ANGEL_VC') {
      maxAuthority = Math.max(maxAuthority, 25);
    } else if (s.source_type === 'OFFICIAL_WEBSITE') {
      maxAuthority = Math.max(maxAuthority, 25);
    } else if (s.source_type === 'SECONDARY_DATABASE' || s.source_type === 'NEWS_ANNOUNCEMENT') {
      maxAuthority = Math.max(maxAuthority, 18);
    }
  }
  score += maxAuthority;

  // 2. Number of Independent Sources (up to 25 points)
  const uniqueDomains = new Set(
    sources
      .map(s => {
        try {
          return new URL(s.source_url).hostname;
        } catch {
          return s.source_name;
        }
      })
      .filter(Boolean)
  );

  if (uniqueDomains.size >= 3) {
    score += 25;
  } else if (uniqueDomains.size === 2) {
    score += 18;
  } else if (uniqueDomains.size === 1) {
    score += 10;
  }

  // 3. Official Website Availability (up to 20 points)
  if (website && website.startsWith('http')) {
    score += 20;
  } else if (website) {
    score += 10;
  }

  // 4. Ecosystem Alignment: StartupTN / DPIIT (up to 10 points)
  if (isStartupTnRegistered || isDpiitRecognized) {
    score += 10;
  }

  // 5. Data Completeness & Consistency (up to 10 points)
  if (hasFounders) score += 5;
  if (hasFunding) score += 5;

  // Normalize score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  // Determine Verification Level
  // Level 3: >= 80 score and at least 2 independent reliable sources
  // Level 2: >= 60 score and at least 1 authoritative source
  // Level 1: >= 40 score (credible secondary / single source)
  // Level 0: < 40 score
  let level: 0 | 1 | 2 | 3 = 0;
  if (finalScore >= 80 && uniqueDomains.size >= 2) {
    level = 3;
  } else if (finalScore >= 60 || (uniqueDomains.size >= 1 && maxAuthority >= 28)) {
    level = 2;
  } else if (finalScore >= 40 || uniqueDomains.size >= 1) {
    level = 1;
  } else {
    level = 0;
  }

  return {
    level,
    confidence_score: finalScore,
    last_verified: nowStr,
    sources,
  };
}
