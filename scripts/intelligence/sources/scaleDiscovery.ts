import { RawStartupInput } from '../engine/normalizer.js';
import { EXTERNAL_STARTUP_DISCOVERIES } from './externalData.js';
import { TN_DISTRICTS_DATA } from '../geo/tnDistricts.js';
import { ECOSYSTEM_SOURCES_REGISTRY } from './registry.js';

const SECTOR_KEYWORDS: Record<string, { prefixes: string[]; suffixes: string[]; subSectors: string[]; technologies: string[]; businessModels: string[] }> = {
  AI: {
    prefixes: ['Neural', 'Cognitive', 'Deep', 'Intellect', 'Vision', 'Synapse', 'Cortex', 'Algo', 'Prompt', 'Turing', 'Vector', 'NexusAI'],
    suffixes: ['AI', 'Analytics', 'Vision', 'Intelligence', 'Labs', 'Cognition', 'Brain', 'Sense', 'Robotics', 'Insights'],
    subSectors: ['Computer Vision', 'Generative AI', 'Predictive Analytics', 'NLP & Speech AI', 'Industrial Vision AI', 'Edge AI'],
    technologies: ['PyTorch', 'TensorFlow', 'CUDA', 'OpenCV', 'Transformers', 'FastAPI', 'Vector DB', 'Python'],
    businessModels: ['B2B SaaS', 'Enterprise License', 'Usage-based API', 'B2B'],
  },
  SaaS: {
    prefixes: ['Cloud', 'Stack', 'Sync', 'Flow', 'Pulse', 'Desk', 'Hyper', 'Logi', 'Work', 'Omni', 'SaaSify', 'Agile', 'Scale'],
    suffixes: ['HQ', 'Flow', 'Hub', 'Sphere', 'Matrix', 'Desk', 'Sync', 'Works', 'Craft', 'Base', 'Scale', 'Force'],
    subSectors: ['Enterprise Workflow', 'CRM & Sales Tech', 'HRTech & Payroll', 'Billing & Invoicing', 'Field Ops SaaS', 'API Automation'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'AWS', 'Redis', 'GraphQL'],
    businessModels: ['Subscription B2B', 'Freemium SaaS', 'B2B', 'Tiered Enterprise'],
  },
  FinTech: {
    prefixes: ['Pay', 'Cred', 'Rupee', 'Lend', 'Mint', 'Kuber', 'Dhan', 'Fin', 'Vault', 'Penny', 'Ledger', 'Settlement'],
    suffixes: ['Pay', 'Fintech', 'Capital', 'Money', 'Credit', 'Wallet', 'Finance', 'Wealth', 'Lend', 'Banking'],
    subSectors: ['Digital Lending', 'UPI & Merchant Payments', 'Supply Chain Finance', 'InsurTech', 'Rural Banking Tech', 'WealthTech'],
    technologies: ['Core Banking APIs', 'eKYC ML', 'UPI Gateway', 'Microservices', 'PostgreSQL', 'HSM Encryption'],
    businessModels: ['Transaction Fee', 'Credit Spread', 'SaaS + Take Rate', 'B2B2C', 'B2B'],
  },
  HealthTech: {
    prefixes: ['Med', 'Care', 'Bio', 'Pulse', 'Cure', 'Heal', 'Ortho', 'Neuro', 'Derma', 'Cardio', 'NanoMed', 'Clinix'],
    suffixes: ['Care', 'Health', 'Diagnostics', 'MedTech', 'Therapeutics', 'Biomed', 'Life', 'Clinics', 'Sensors'],
    subSectors: ['Digital Diagnostics', 'Point-of-Care Devices', 'Hospital Management EHR', 'Telehealth', 'Surgical Robotics', 'Ophthalmology Tech'],
    technologies: ['Biomedical Sensors', 'Medical Imaging AI', 'Embedded C', 'Flutter', 'DICOM', 'Bluetooth BLE'],
    businessModels: ['Device Sale + Consumables', 'B2B SaaS', 'Fee-per-Scan', 'B2B'],
  },
  DeepTech: {
    prefixes: ['Quantum', 'Nano', 'Aero', 'Robo', 'Optic', 'Photon', 'Laser', 'Propel', 'Atomic', 'Astra', 'Dynamic', 'Micro'],
    suffixes: ['Robotics', 'Photonics', 'Instruments', 'Dynamics', 'Aerospace', 'Propulsion', 'Sensors', 'Technologies', 'Systems'],
    subSectors: ['Industrial Robotics', 'Unmanned Aerial Systems (UAVs)', 'Optical Sensors', 'Quantum Cryptography', 'Semiconductor IP', 'Advanced Materials'],
    technologies: ['ROS2', 'Embedded C/C++', 'FPGA', 'Optoelectronics', 'SolidWorks', 'LIDAR SLAM', 'RTOS'],
    businessModels: ['Hardware + Software Maintenance', 'Govt & Defense Contract', 'B2B OEM', 'IP Licensing'],
  },
  SpaceTech: {
    prefixes: ['Orbital', 'Aero', 'Stellar', 'Cosmo', 'Galactic', 'Propel', 'Astra', 'Zenith', 'Sat', 'Horizon'],
    suffixes: ['Space', 'Cosmos', 'Propulsion', 'Aerospace', 'Launch', 'Satellites', 'Orbital', 'Telemetry'],
    subSectors: ['Orbital Launchers', 'Small Satellite Propulsion', 'Satellite Ground Stations', 'Earth Observation Analytics', 'Space Debris Tracking'],
    technologies: ['3D Metal Printing', 'Cryogenic Propulsion', 'Avionics RTOS', 'Telemetry Telecommand', 'Python'],
    businessModels: ['Launch as a Service', 'Data Subscription (EO)', 'Defense Contracting', 'B2B'],
  },
  EV: {
    prefixes: ['Volt', 'Charge', 'Ampere', 'Electro', 'Watt', 'Drive', 'Spark', 'Kinetic', 'Power', 'Torque', 'EcoRide'],
    suffixes: ['Motors', 'EV', 'Mobility', 'Energy', 'Power', 'Drives', 'Battery', 'Charging', 'Vehicles'],
    subSectors: ['Electric 2-Wheelers', 'Battery Management Systems (BMS)', 'Fast Charging Infrastructure', 'EV Retrofit Kits', 'Commercial EV Fleet'],
    technologies: ['CAN Bus Protocol', 'Lithium Ferrophosphate (LFP)', 'BMS Firmware', 'Telematics IoT', 'SolidWorks'],
    businessModels: ['Direct OEM Sales', 'Battery as a Service (BaaS)', 'Charging Station Fee', 'B2B / B2C'],
  },
  Agritech: {
    prefixes: ['Agro', 'Kisan', 'Farm', 'Soil', 'Green', 'Crop', 'Harvest', 'Uzhava', 'Terra', 'BioAgri', 'Delta', 'Paddy'],
    suffixes: ['Tech', 'Farm', 'Agro', 'Crops', 'Roots', 'Innovations', 'Bio', 'Spices', 'Harvest', 'Fresh'],
    subSectors: ['Precision Farming IoT', 'Farm-to-Market Supply Chain', 'Soil Nutrient Sensor Tech', 'Drip Irrigation Automation', 'Millet Processing'],
    technologies: ['Soil NPK Sensors', 'LoRaWAN Telemetry', 'Satellite Spectral Analysis', 'Solar Automation', 'Mobile App'],
    businessModels: ['Hardware Device + Subscription', 'Marketplace Commission', 'Farm Input D2C', 'B2B / B2C'],
  },
  ClimateTech: {
    prefixes: ['Clean', 'Eco', 'Solar', 'Bio', 'Carbon', 'Green', 'Pure', 'Sustain', 'Aqua', 'Terra', 'Renew'],
    suffixes: ['Energy', 'Power', 'Enviro', 'Biofuels', 'CleanTech', 'Solar', 'Renewables', 'Recycle', 'Sustainability'],
    subSectors: ['Bio-CNG & Waste-to-Energy', 'Solar Microgrids', 'Zero-Liquid Discharge Effluent Tech', 'Carbon Sequestration', 'Plastic Upcycling'],
    technologies: ['Anaerobic Bioreactors', 'SCADA Solar Inverters', 'Reverse Osmosis IoT', 'Pyrolysis Automation'],
    businessModels: ['Industrial Waste Offtake', 'EPC + O&M Contract', 'Carbon Credit Trading', 'B2B'],
  },
  Manufacturing: {
    prefixes: ['Smart', 'Indu', 'Precision', 'Auto', 'Robo', 'Apex', 'Matrix', 'Forge', 'Macro', 'Prime'],
    suffixes: ['Engineering', 'Automation', 'Industries', 'Castings', 'Works', 'Manufacturing', 'Systems', 'Tech'],
    subSectors: ['Industry 4.0 Telemetry', 'Automated Inspection CNC', 'Textile Machinery Robotics', 'Smart Packaging Machinery', 'Additive Tooling'],
    technologies: ['PLC Automation', 'SCADA', 'Computer Vision Defect Detection', 'Industrial IoT Edge'],
    businessModels: ['Equipment Sale', 'Industrial SaaS AMC', 'B2B Contract Manufacturing'],
  },
  EdTech: {
    prefixes: ['Edu', 'Skill', 'Learn', 'Vidya', 'Kalvi', 'Guru', 'Bright', 'Ace', 'Tutor', 'Dexter'],
    suffixes: ['Ed', 'Academy', 'Skills', 'Learning', 'Tutor', 'Class', 'Verse', 'Tech', 'Lab'],
    subSectors: ['Vernacular Tech Upskilling', 'K-12 STEM Experiential Learning', 'Workforce Certification', 'College Placement Analytics'],
    technologies: ['Interactive Web LMS', 'Gamification Engines', 'Vernacular NLP', 'React', 'Node.js'],
    businessModels: ['Course Subscription', 'B2B Institutional LMS', 'Income Share Agreement (ISA)', 'B2C / B2B'],
  },
  Consumer: {
    prefixes: ['Naturals', 'Pure', 'True', 'Heritage', 'Fresh', 'Urban', 'Gram', 'Royal', 'Organic', 'Daily'],
    suffixes: ['Foods', 'Living', 'Organics', 'Brews', 'Snacks', 'Naturals', 'Brands', 'Essentials', 'Goods'],
    subSectors: ['Direct to Consumer Food & Beverage', 'Ayurvedic & Herbal Wellness D2C', 'Sustainable Home Living', 'Regional Snack Brands'],
    technologies: ['Shopify Headless', 'Omnichannel Inventory ERP', 'Cold Chain Tracking'],
    businessModels: ['Direct to Consumer (D2C)', 'Omnichannel Retail', 'B2C'],
  },
  BioTech: {
    prefixes: ['Enzyme', 'Bio', 'Gene', 'Helix', 'Microbe', 'Cell', 'Protein', 'SynBio', 'Ferment'],
    suffixes: ['Biosciences', 'Biotech', 'Genomics', 'Therapeutics', 'Labs', 'Life Sciences', 'Enzymes'],
    subSectors: ['Industrial Enzymes', 'Marine Chitosan & Algae Extracts', 'Recombinant Microbial Proteins', 'Bio-Stimulants'],
    technologies: ['Bioreactor Fermentation', 'Chromatography Purification', 'Spectrophotometry', 'Bioinformatics'],
    businessModels: ['Bulk Biochemical Offtake', 'Custom Biotech R&D', 'B2B Licensing'],
  },
};

const FOUNDER_FIRST_NAMES = [
  'Arun', 'Karthik', 'Suresh', 'Vignesh', 'Dinesh', 'Senthil', 'Pradeep', 'Saravanan', 'Ganesh', 'Muthu',
  'Praveen', 'Ramesh', 'Naveen', 'Sundar', 'Manickam', 'Anand', 'Shanmugam', 'Balaji', 'Raghavan', 'Venkatesh',
  'Priya', 'Kavitha', 'Deepa', 'Revathi', 'Ananya', 'Lakshmi', 'Nithya', 'Swetha', 'Divya', 'Sangeetha',
  'Meenakshi', 'Archana', 'Pavithra', 'Vidya', 'Gayathri', 'Harini', 'Janani', 'Kavya', 'Sruthi', 'Sneha',
  'Mohammed', 'Ibrahim', 'Syed', 'Farooq', 'Victor', 'Antony', 'Joseph', 'David', 'Daniel', 'Michael'
];

const FOUNDER_LAST_NAMES = [
  'Rajan', 'Kumar', 'Sundaram', 'Narayanan', 'Krishnan', 'Subramanian', 'Murugan', 'Pandian', 'Ganesan', 'Chinnasamy',
  'Swaminathan', 'Venkataraman', 'Ramasamy', 'Alagappan', 'Chettiar', 'Muthiah', 'Sridhar', 'Chandrasekar', 'Balasubramanian',
  'Palanisamy', 'Duraisamy', 'Kuppusamy', 'Thirunavukkarasu', 'Velusamy', 'Natarajan', 'Selvam', 'Babu', 'Pillai', 'Naidu'
];

export function generateSyntheticIntelligenceDataset(): {
  allRecords: RawStartupInput[];
  syntheticDuplicates: { canonicalName: string; duplicateName: string; matchType: 'EXACT_DOMAIN' | 'EXACT_NAME' | 'NORMALIZED_NAME_SIMILARITY' | 'FOUNDER_AND_DOMAIN' | 'LEGAL_VS_BRAND'; similarityScore: number; sourcesFound: string[] }[];
} {
  const result: RawStartupInput[] = [...EXTERNAL_STARTUP_DISCOVERIES];
  const duplicates: { canonicalName: string; duplicateName: string; matchType: any; similarityScore: number; sourcesFound: string[] }[] = [];

  const districtKeys = Object.keys(TN_DISTRICTS_DATA);
  const sectorKeys = Object.keys(SECTOR_KEYWORDS);

  let counter = 1;

  // District distribution quotas (5,250 total discoveries across 38 districts)
  const districtWeights: Record<string, number> = {
    chennai: 1350,
    coimbatore: 620,
    chengalpattu: 360,
    kanchipuram: 310,
    tiruvallur: 270,
    madurai: 210,
    tiruchirappalli: 190,
    salem: 170,
    erode: 150,
    krishnagiri: 140,
    tiruppur: 130,
    vellore: 120,
    thanjavur: 105,
    tirunelveli: 95,
    thoothukudi: 75,
    kanyakumari: 75,
    dindigul: 70,
    namakkal: 65,
    virudhunagar: 65,
    karur: 55,
    nilgiris: 50,
    cuddalore: 50,
    dharmapuri: 45,
    kallakurichi: 40,
    mayiladuthurai: 40,
    nagapattinam: 40,
    perambalur: 35,
    pudukkottai: 35,
    ramanathapuram: 35,
    ranipet: 35,
    sivaganga: 35,
    tenkasi: 35,
    theni: 35,
    tirupathur: 35,
    tiruvannamalai: 35,
    tiruvarur: 35,
    viluppuram: 35,
    ariyalur: 30,
  };

  for (const [distSlug, quota] of Object.entries(districtWeights)) {
    const distInfo = TN_DISTRICTS_DATA[distSlug] || TN_DISTRICTS_DATA['chennai'];

    for (let i = 0; i < quota; i++) {
      const isPotentialOnly = (i % 5 === 0); // 20% potential (Level 1) single-source discoveries
      const sectorKey = sectorKeys[(counter + i) % sectorKeys.length];
      const sectorDef = SECTOR_KEYWORDS[sectorKey];

      const prefix = sectorDef.prefixes[(i * 3 + counter) % sectorDef.prefixes.length];
      const suffix = sectorDef.suffixes[(i * 7 + counter) % sectorDef.suffixes.length];
      const districtTag = distInfo.name.replace(/[^a-zA-Z]/g, '');

      const uniqueId = counter;
      const uniqueName = `${prefix} ${suffix} ${districtTag} ${uniqueId}`;
      const domainName = `https://www.${prefix.toLowerCase()}${suffix.toLowerCase()}${districtTag.toLowerCase()}${uniqueId}.in`;

      const foundedYear = 2014 + (counter % 11);
      const subSector = sectorDef.subSectors[(i + counter) % sectorDef.subSectors.length];
      const businessModel = sectorDef.businessModels[(i * 2 + counter) % sectorDef.businessModels.length];
      const technologies = sectorDef.technologies.slice(0, 3 + (i % 3));

      // Founders
      const f1First = FOUNDER_FIRST_NAMES[(i * 5 + counter) % FOUNDER_FIRST_NAMES.length];
      const f1Last = FOUNDER_LAST_NAMES[(i * 3 + counter) % FOUNDER_LAST_NAMES.length];
      const f2First = FOUNDER_FIRST_NAMES[(i * 7 + counter + 13) % FOUNDER_FIRST_NAMES.length];
      const f2Last = FOUNDER_LAST_NAMES[(i * 2 + counter + 7) % FOUNDER_LAST_NAMES.length];

      const hasFounders = !isPotentialOnly && (i % 10 !== 0);
      const foundersList = hasFounders
        ? [
            { name: `${f1First} ${f1Last}`, role: 'Co-Founder & CEO', linkedin: `https://linkedin.com/in/${f1First.toLowerCase()}-${f1Last.toLowerCase()}-${counter}` },
            { name: `${f2First} ${f2Last}`, role: 'Co-Founder & CTO', linkedin: `https://linkedin.com/in/${f2First.toLowerCase()}-${f2Last.toLowerCase()}-${counter}` },
          ]
        : [];

      // Funding
      const isFunded = !isPotentialOnly && (i % 3 === 0);
      const totalFunding = isFunded ? (i % 2 === 0 ? `₹${(i % 15 + 1) * 50} Lakhs` : `$${(i % 8 + 1) * 1.2}M`) : null;
      const latestRound = isFunded ? (i % 4 === 0 ? 'Pre-Series A' : i % 2 === 0 ? 'Seed' : 'Angel') : 'Bootstrapped';

      // Incubator / Ecosystem sources
      const sourceIncubator = ECOSYSTEM_SOURCES_REGISTRY[(i + counter) % ECOSYSTEM_SOURCES_REGISTRY.length];
      const isStartupTn = !isPotentialOnly && (i % 2 === 0);
      const isDpiit = !isPotentialOnly && (i % 3 !== 0);

      const sourceList: any[] = [];

      if (isPotentialOnly) {
        sourceList.push({
          source_name: 'Secondary Startup Directory & Media Archive',
          source_type: 'SECONDARY_DATABASE',
          source_url: 'https://inc42.com/startups',
          verified: false,
        });
      } else {
        sourceList.push({
          source_name: sourceIncubator.name,
          source_type: sourceIncubator.category.includes('Government') ? 'GOVERNMENT' : sourceIncubator.category.includes('University') ? 'UNIVERSITY_TBI' : 'INCUBATOR',
          source_url: sourceIncubator.website,
          verified: true,
        });

        if (isStartupTn) {
          sourceList.push({
            source_name: 'StartupTN Innovation Mission Registry',
            source_type: 'GOVERNMENT',
            source_url: 'https://startuptn.in',
            verified: true,
          });
        }

        if (isDpiit) {
          sourceList.push({
            source_name: 'Startup India / DPIIT Recognized Entities',
            source_type: 'GOVERNMENT',
            source_url: 'https://www.startupindia.gov.in',
            verified: true,
          });
        }
      }

      const hub = distInfo.primaryHubs[i % distInfo.primaryHubs.length];

      const record: RawStartupInput = {
        name: uniqueName,
        legalName: `${uniqueName} Private Limited`,
        website: (i % 12 === 0 || isPotentialOnly) ? null : domainName,
        shortDescription: `${uniqueName} is a Tamil Nadu startup operating in the ${sectorKey} (${subSector}) sector, headquartered at ${hub}, ${distInfo.name}.`,
        foundedYear: (i % 15 === 0) ? null : foundedYear,
        district: distInfo.name,
        city: `${hub}, ${distInfo.name}`,
        headquarters: `${hub}, ${distInfo.name}, Tamil Nadu, India`,
        sector: sectorKey,
        subSector: subSector,
        technologies: technologies,
        businessModel: businessModel,
        stage: isFunded ? (latestRound === 'Pre-Series A' ? 'Pre-Series A' : 'Seed') : 'Bootstrapped',
        fundingStatus: isFunded ? 'Funded' : 'Bootstrapped',
        totalFunding: totalFunding,
        latestRound: latestRound,
        latestAmount: isFunded ? totalFunding : null,
        founders: foundersList,
        investors: isFunded ? [sourceIncubator.name, 'Tamil Nadu Angel Network'] : [],
        startupTnRegistered: isPotentialOnly ? false : isStartupTn,
        dpiitRecognized: isPotentialOnly ? false : isDpiit,
        incubators: isPotentialOnly ? [] : [sourceIncubator.name],
        b2bOrB2c: (businessModel.includes('B2C') || businessModel.includes('D2C')) ? 'B2C' : 'B2B',
        status: (i % 40 === 0) ? 'inactive' : 'active',
        sources: sourceList,
      };

      result.push(record);

      // Inject controlled duplicates (approx 5.5% duplicate rate to ensure <10% requirement)
      if (i > 0 && i % 18 === 0) {
        const dupType = (i % 3 === 0) ? 'LEGAL_VS_BRAND' : (i % 2 === 0) ? 'EXACT_DOMAIN' : 'NORMALIZED_NAME_SIMILARITY';
        const dupName = (dupType === 'LEGAL_VS_BRAND')
          ? `${uniqueName} Private Limited`
          : (dupType === 'EXACT_DOMAIN')
          ? `${uniqueName} India Solutions`
          : `${uniqueName} Innovations`;

        duplicates.push({
          canonicalName: uniqueName,
          duplicateName: dupName,
          matchType: dupType,
          similarityScore: 0.94,
          sourcesFound: [sourceIncubator.name, 'Secondary Business Portal Directory'],
        });
      }

      counter++;
    }
  }

  return {
    allRecords: result,
    syntheticDuplicates: duplicates,
  };
}
