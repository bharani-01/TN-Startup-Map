import path from 'path';

export const INTELLIGENCE_CONFIG = {
  outputDir: path.resolve(process.cwd(), 'data/intelligence'),
  confidenceWeights: {
    sourceAuthority: 35,
    independentSources: 25,
    websiteAvailability: 20,
    startupTnDpiitEvidence: 10,
    mcaEvidenceAndRecency: 10,
  },
  verificationThresholds: {
    level3HighlyVerified: 80, // >= 80 and at least 2 strong sources
    level2Verified: 60,       // >= 60 and at least 1 authoritative source
    level1Discovered: 40,     // >= 40 (credible secondary discovery)
    level0Unverified: 0,      // < 40 (weak evidence)
  },
  datasets: {
    datasetA: 'dataset_a_verified_startups',
    datasetB: 'dataset_b_potential_startups',
    datasetC: 'dataset_c_duplicate_records',
    datasetD: 'dataset_d_missing_information',
    analyticsReport: 'tamil_nadu_startup_intelligence_report.json',
  },
};
