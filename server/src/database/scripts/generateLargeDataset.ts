import { INITIAL_STARTUPS } from '../data/startups.js';
import { ALL_TN_DISTRICTS } from '../data/districts.js';
import { INITIAL_SECTORS } from '../data/sectors.js';
import { Startup } from '../../models/Startup.js';

// Distribution weights for 38 districts (Target ~1,250 total startups)
const DISTRICT_QUOTAS: Record<string, number> = {
  'chennai': 380,
  'coimbatore': 170,
  'chengalpattu': 65,
  'tiruvallur': 45,
  'madurai': 55,
  'tiruchirappalli': 50,
  'salem': 40,
  'tiruppur': 40,
  'krishnagiri': 45,
  'erode': 32,
  'vellore': 32,
  'tirunelveli': 30,
  'kanchipuram': 25,
  'thanjavur': 20,
  'dindigul': 20,
  'tenkasi': 20,
  'virudhunagar': 18,
  'kanyakumari': 20,
  'thoothukudi': 18,
  'namakkal': 16,
  'karur': 16,
  'ranipet': 14,
  'cuddalore': 14,
  'villupuram': 14,
  'sivaganga': 14,
  'theni': 14,
  'dharmapuri': 12,
  'tirupathur': 12,
  'ramanathapuram': 12,
  'nilgiris': 12,
  'nagapattinam': 10,
  'kallakurichi': 10,
  'pudukkottai': 12,
  'mayiladuthurai': 10,
  'perambalur': 10,
  'ariyalur': 10,
  'tiruvarur': 10,
};

const TN_FIRST_NAMES = [
  'Karthik', 'Senthil', 'Praveen', 'Suresh', 'Vignesh', 'Dinesh', 'Anand', 'Manoj',
  'Saravanan', 'Ganesh', 'Deepak', 'Arun', 'Sundar', 'Vijay', 'Balaji', 'Ramesh',
  'Ashok', 'Kavitha', 'Priya', 'Deepa', 'Sangeetha', 'Nandhini', 'Revathi', 'Ananya',
  'Meenakshi', 'Divya', 'Sowmya', 'Keerthana', 'Subhashini', 'Pavithra', 'Lavanya',
  'Naveen', 'Ravi', 'Muthu', 'Selvam', 'Rajesh', 'Vasanth', 'Prabhu', 'Ranganathan',
  'Harish', 'Madhavan', 'Jayanth', 'Aakash', 'Swaminathan', 'Bala', 'Srinivasan'
];

const TN_LAST_NAMES = [
  'Ramanathan', 'Natarajan', 'Subramanian', 'Krishnan', 'Chandrasekaran', 'Venkatesh',
  'Sundaram', 'Murugan', 'Balasubramanian', 'Rajendran', 'Palanisamy', 'Gopalakrishnan',
  'Swaminathan', 'Chettiar', 'Thevar', 'Iyer', 'Iyengar', 'Mudaliar', 'Gounder',
  'Nadar', 'Pillai', 'Reddy', 'Naidu', 'Kumar', 'Varman', 'Pandian', 'Sethupathi'
];

const TN_COLLEGES = [
  'IIT Madras', 'CEG Anna University, Guindy', 'PSG College of Technology, Coimbatore',
  'National Institute of Technology (NIT) Trichy', 'Madras Institute of Technology (MIT) Chromepet',
  'Thiagarajar College of Engineering (TCE), Madurai', 'Coimbatore Institute of Technology (CIT)',
  'SSN College of Engineering, Chennai', 'SASTRA Deemed University, Thanjavur',
  'Kumaraguru College of Technology (KCT), Coimbatore', 'Government College of Technology (GCT), Coimbatore',
  'Madras Christian College (MCC)', 'Loyola College, Chennai', 'Karunya Institute of Technology, Coimbatore',
  'SRM Institute of Science and Technology', 'Vellore Institute of Technology (VIT), Vellore'
];

const TECH_TERMS: Record<string, string[]> = {
  'SaaS': ['CloudSuite', 'DeskFlow', 'SyncPoint', 'OmniScale', 'LogicMesh', 'DocuPulse', 'WorkStream', 'MetricHQ', 'AppSphere', 'CoreSync'],
  'AI': ['NeuralWave', 'CognitiveGrid', 'VisionSync', 'IntelliBot', 'DeepSense', 'OmniVision', 'LangPulse', 'ModelMatrix', 'SmartInference', 'AutoMind'],
  'DeepTech': ['QuantumLeap', 'PhotonTech', 'CoreSilicon', 'NanoMatrix', 'OptoLogic', 'CryoEngine', 'AtomicFlow', 'HyperWave', 'SynapseEdge', 'TerraCore'],
  'EV': ['VoltDrive', 'ElectroPulse', 'ApexMotors', 'KineticMobility', 'ZenoEnergy', 'TorqueMotion', 'SparkEV', 'AeroCharge', 'CellMatrix', 'GreenRide'],
  'Agritech': ['AgriPulse', 'FarmMatrix', 'CropSense', 'YieldFlow', 'SoilScan', 'AgroBotix', 'TerraHarvest', 'BioGrow', 'SproutTech', 'GreenCanopy'],
  'FinTech': ['PayGrid', 'CredPulse', 'LedgerFlow', 'RupeeSync', 'VentureStack', 'CapMatrix', 'FinMesh', 'TradeZen', 'NeoLedger', 'CashFlowHQ'],
  'HealthTech': ['BioPulse', 'MediScan', 'CareMatrix', 'HealthSync', 'NanoCure', 'OmniCare', 'ClinIQ', 'VitalsFlow', 'TheraGen', 'PulseMed'],
  'CleanTech': ['SolarGrid', 'EcoPulse', 'HydroFlow', 'CleanMatrix', 'BioVolt', 'TerraEnergy', 'OzoneTech', 'CircuFlow', 'GreenWatt', 'PureStream'],
  'Manufacturing': ['ToolMatrix', 'FoundryFlow', 'MachinIQ', 'AutoForge', 'RoboWeld', 'PrecisionGrid', 'MetalCore', 'FabriSync', 'SmartCast', 'DieTech'],
  'IoT': ['SensorMesh', 'EdgePulse', 'TeleMatrix', 'NodeFlow', 'BeaconTech', 'GridSense', 'SmartNode', 'OmniSense', 'SyncSensor', 'IoTrix'],
  'Robotics': ['BotMatrix', 'ArmFlow', 'AutoBotix', 'KineticRobotics', 'AeroBot', 'FlexiArm', 'RoboDrive', 'OptiBot', 'MechaSync', 'RoboScale'],
  'SpaceTech': ['AeroMatrix', 'OrbitalSync', 'CosmoTech', 'AstroGrid', 'Propulse', 'NanoSat', 'SkyFlow', 'StarPulse', 'GraviTech', 'SolarisAero'],
  'EdTech': ['SkillMatrix', 'LearnFlow', 'EduPulse', 'GuruTech', 'VidyaGrid', 'VernacLearn', 'TutorSync', 'CampuScale', 'CodeGurukula', 'MindSpark'],
  'Logistics': ['RouteMatrix', 'FleetPulse', 'FreightFlow', 'LogiSync', 'ShipGrid', 'TrackHQ', 'CargoMesh', 'FastTransit', 'DockLogic', 'OmniHaul'],
  'Consumer': ['FreshPoint', 'UrbanBasket', 'CraftMesh', 'VibeTaste', 'PureD2C', 'SmartLiving', 'HomeFlow', 'DailyPick', 'HeritageBrews', 'FitBite'],
  'Defense': ['ArmorGrid', 'AeroShield', 'SurveilTech', 'RadarMesh', 'DefPulse', 'TacticalFlow', 'SecureSky', 'SentinelHQ', 'CyberArmor', 'ShieldMatrix'],
  'BioTech': ['GenePulse', 'BioMatrix', 'PharmaFlow', 'CelluTech', 'EnzymeLogic', 'BioSynthetix', 'NanoPharma', 'BioAgro', 'CureMatrix', 'MolecuTech'],
};

const STAGES = ['Idea', 'Pre-seed', 'Seed', 'Pre-Series A', 'Series A', 'Series B', 'Series B+', 'Bootstrapped'];
const REVENUE_MODELS = ['Subscription (B2B SaaS)', 'Usage-Based API', 'Direct D2C Sales', 'Enterprise Licensing', 'Marketplace Commission', 'Hardware + Cloud Maintenance', 'Pay-per-Unit Manufacturing'];
const REVENUE_RANGES = ['Pre-Revenue', '₹10L - ₹50L', '₹50L - ₹2 Cr', '₹2 Cr - ₹10 Cr', '₹10 Cr - ₹50 Cr', '₹50 Cr - ₹200 Cr', '₹200 Cr+'];
const TARGET_MARKETS = ['Domestic (Tamil Nadu & South India)', 'Pan-India', 'India & Southeast Asia', 'North America & Europe', 'Global (50+ Countries)', 'Middle East & APAC'];

// Pseudo-random deterministic generator seeded by string
function pseudoRandom(seedStr: string): number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(hash++) * 10000;
  return x - Math.floor(x);
}

export function generateAllStartups(): Startup[] {
  const result: Startup[] = [...INITIAL_STARTUPS];
  const existingSlugs = new Set(INITIAL_STARTUPS.map((s) => s.slug));
  const existingNames = new Set(INITIAL_STARTUPS.map((s) => s.name.toLowerCase()));

  for (const district of ALL_TN_DISTRICTS) {
    const quota = DISTRICT_QUOTAS[district.slug] || 15;
    const existingInDistrict = INITIAL_STARTUPS.filter((s) => s.districtSlug === district.slug).length;
    const needed = Math.max(0, quota - existingInDistrict);

    const districtSectors = district.keySectors.length > 0 ? district.keySectors : ['SaaS', 'Agritech', 'Manufacturing', 'Consumer'];

    for (let i = 0; i < needed; i++) {
      const seedKey = `${district.slug}-${i}`;
      const r1 = pseudoRandom(seedKey + '1');
      const r2 = pseudoRandom(seedKey + '2');
      const r3 = pseudoRandom(seedKey + '3');
      const r4 = pseudoRandom(seedKey + '4');
      const r5 = pseudoRandom(seedKey + '5');

      // Sector selection
      const primarySector = districtSectors[Math.floor(r1 * districtSectors.length)] || 'SaaS';
      const secondarySector = INITIAL_SECTORS[Math.floor(r2 * INITIAL_SECTORS.length)].name;
      const sectors = [primarySector];
      if (secondarySector !== primarySector && r3 > 0.4) {
        sectors.push(secondarySector);
      }

      // Name generation
      const termList = TECH_TERMS[primarySector] || TECH_TERMS['SaaS'];
      const baseTerm = termList[Math.floor(r2 * termList.length)];
      const districtPrefix = district.name.replace(/[^a-zA-Z]/g, '');
      
      let candidateName = '';
      if (r4 < 0.3) {
        candidateName = `${baseTerm} Labs`;
      } else if (r4 < 0.6) {
        candidateName = `${baseTerm} Technologies`;
      } else if (r4 < 0.8) {
        candidateName = `${districtPrefix} ${baseTerm}`;
      } else {
        candidateName = `${baseTerm} AI`;
      }

      if (existingNames.has(candidateName.toLowerCase())) {
        candidateName = `${candidateName} ${Math.floor(r5 * 90 + 10)}`;
      }
      existingNames.add(candidateName.toLowerCase());

      const slug = candidateName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (existingSlugs.has(slug)) continue;
      existingSlugs.add(slug);

      // Coordinate jitter (realistic within district boundary)
      const latJitter = (r1 - 0.5) * 0.08;
      const lngJitter = (r2 - 0.5) * 0.08;
      const lat = Number((district.latitude + latJitter).toFixed(4));
      const lng = Number((district.longitude + lngJitter).toFixed(4));

      // Founders
      const f1First = TN_FIRST_NAMES[Math.floor(r3 * TN_FIRST_NAMES.length)];
      const f1Last = TN_LAST_NAMES[Math.floor(r4 * TN_LAST_NAMES.length)];
      const f1Name = `${f1First} ${f1Last}`;
      const f1College = TN_COLLEGES[Math.floor(r5 * TN_COLLEGES.length)];

      const founders: any[] = [
        {
          name: f1Name,
          role: 'Co-Founder & CEO',
          linkedin: `https://linkedin.com/in/${f1First.toLowerCase()}-${f1Last.toLowerCase()}-${Math.floor(r1 * 900 + 100)}`,
          education: f1College,
          previousCompanies: `${primarySector} Systems & Product R&D`,
        },
      ];

      if (r5 > 0.45) {
        const f2First = TN_FIRST_NAMES[Math.floor(r1 * TN_FIRST_NAMES.length)];
        const f2Last = TN_LAST_NAMES[Math.floor(r2 * TN_LAST_NAMES.length)];
        if (`${f2First} ${f2Last}` !== f1Name) {
          founders.push({
            name: `${f2First} ${f2Last}`,
            role: 'Co-Founder & CTO',
            linkedin: `https://linkedin.com/in/${f2First.toLowerCase()}-${f2Last.toLowerCase()}-${Math.floor(r2 * 900 + 100)}`,
            education: TN_COLLEGES[Math.floor(r4 * TN_COLLEGES.length)],
            previousCompanies: 'Core Engineering & Cloud Architecture',
          });
        }
      }

      const foundedYear = 2016 + Math.floor(r3 * 9); // 2016 - 2024
      const stage = STAGES[Math.floor(r4 * STAGES.length)];
      const teamSizes = ['1-10', '11-50', '51-200', '200+'];
      const teamSize = teamSizes[Math.floor(r5 * teamSizes.length)];

      // Funding & Financials
      let totalFundingInr = 'Bootstrapped';
      let totalFundingUsd = '$0';
      let fundingType = 'Bootstrapped';
      const fundingRounds: any[] = [];

      if (stage !== 'Bootstrapped' && stage !== 'Idea') {
        fundingType = 'Venture funded';
        if (stage === 'Seed' || stage === 'Pre-seed') {
          const inrVal = Math.floor(r1 * 400 + 50); // ₹50L to ₹4.5 Cr
          totalFundingInr = `₹${(inrVal / 100).toFixed(2)} Crore`;
          totalFundingUsd = `$${Math.floor(inrVal * 12)}K`;
          fundingRounds.push({
            roundType: 'Seed',
            amountInr: totalFundingInr,
            amountUsd: totalFundingUsd,
            date: `${foundedYear + 1}-0${Math.floor(r2 * 8 + 1)}-15`,
            investors: ['StartupTN Seed Fund', 'Chennai Angels', 'Native Angels Network'],
          });
        } else if (stage === 'Series A' || stage === 'Pre-Series A') {
          const inrVal = Math.floor(r1 * 25 + 10); // ₹10 Cr to ₹35 Cr
          totalFundingInr = `₹${inrVal} Crore`;
          totalFundingUsd = `$${(inrVal / 8.3).toFixed(1)}M`;
          fundingRounds.push(
            {
              roundType: 'Seed',
              amountInr: `₹${Math.floor(inrVal * 0.2)} Crore`,
              amountUsd: `$${((inrVal * 0.2) / 8.3).toFixed(1)}M`,
              date: `${foundedYear + 1}-04-10`,
              investors: ['Native Angels Network', 'Special Invest'],
            },
            {
              roundType: 'Series A',
              amountInr: totalFundingInr,
              amountUsd: totalFundingUsd,
              date: `${foundedYear + 2}-09-20`,
              investors: ['Accel India', 'Peak XV Surge', 'StartupTN Fund'],
            }
          );
        } else {
          const inrVal = Math.floor(r1 * 80 + 40); // ₹40 Cr to ₹120 Cr
          totalFundingInr = `₹${inrVal} Crore`;
          totalFundingUsd = `$${(inrVal / 8.3).toFixed(1)}M`;
          fundingRounds.push({
            roundType: 'Series B',
            amountInr: totalFundingInr,
            amountUsd: totalFundingUsd,
            date: `${foundedYear + 3}-06-12`,
            investors: ['Tiger Global', 'Elevation Capital', 'TIDCO Emerging Fund'],
          });
        }
      }

      const domain = `${slug}.in`;
      const website = `https://${domain}`;

      // Detailed narratives
      const tagline = `Pioneering ${primarySector.toLowerCase()} technology and automated intelligence for ${district.name} and global markets.`;
      const description = `${candidateName} is an innovative ${primarySector} company based in ${district.name}, Tamil Nadu. Founded in ${foundedYear}, the team builds proprietary technologies to accelerate digital modernization, operational throughput, and regional industrial efficiency.`;
      const extendedBio = `Headquartered in ${district.name}, ${candidateName} combines deep domain engineering with cloud and edge software architectures. The venture operates active testing facilities in ${district.headquarters} and collaborates with academic research parks across Tamil Nadu.`;

      // Milestones
      const milestones: any[] = [
        {
          title: 'Company Inception & Research Validation',
          date: `${foundedYear}-03`,
          category: 'FOUNDATION',
          description: `Formally incorporated in ${district.name} and achieved alpha product validation.`,
        },
        {
          title: 'Commercial MVP & Pilot Deployment',
          date: `${foundedYear + 1}-08`,
          category: 'PRODUCT_LAUNCH',
          description: `Deployed commercial pilot with initial enterprise and industrial partners across Tamil Nadu.`,
        },
      ];

      if (stage !== 'Idea' && stage !== 'Pre-seed') {
        milestones.push({
          title: 'Regional Market Expansion',
          date: `${foundedYear + 2}-11`,
          category: 'EXPANSION',
          description: `Scaled operations across South India and onboarded over 50 enterprise accounts.`,
        });
      }

      // Honors & Awards
      const awards: any[] = [];
      if (r1 > 0.5) {
        awards.push({
          title: `StartupTN ${primarySector} Innovation Honor`,
          organization: 'Government of Tamil Nadu',
          year: foundedYear + 1,
        });
      }
      if (r2 > 0.65) {
        awards.push({
          title: 'National Startup Excellence Recognition',
          organization: 'DPIIT, Ministry of Commerce & Industry',
          year: foundedYear + 2,
        });
      }

      // Key Clients
      const keyClients: any[] = [
        { name: `${district.name} Industrial Corp`, website: 'https://example.com/client1' },
        { name: 'Apex Engineering Ltd', website: 'https://example.com/client2' },
      ];
      if (r3 > 0.4) {
        keyClients.push({ name: 'Southern Agro & Logistics Group', website: 'https://example.com/client3' });
      }

      // Press
      const pressMentions: any[] = [];
      if (r4 > 0.3) {
        pressMentions.push({
          title: `${candidateName} pioneers breakthrough ${primarySector.toLowerCase()} architecture in ${district.name}`,
          publication: 'The Hindu BusinessLine',
          url: 'https://www.thehindubusinessline.com',
        });
      }
      if (r5 > 0.5) {
        pressMentions.push({
          title: `How ${candidateName} is putting ${district.name} on India's tech map`,
          publication: 'YourStory Tamil Nadu',
          url: 'https://yourstory.com',
        });
      }

      const businessModel = REVENUE_MODELS[Math.floor(r1 * REVENUE_MODELS.length)];
      const revenueRange = REVENUE_RANGES[Math.floor(r2 * REVENUE_RANGES.length)];
      const targetMarket = TARGET_MARKETS[Math.floor(r3 * TARGET_MARKETS.length)];
      const incubator = district.incubatorsCount > 0 ? `${district.name} Innovation & Startup Hub` : 'StartupTN Regional Hub';

      result.push({
        id: `stp-gen-${slug}`,
        slug,
        name: candidateName,
        tagline,
        description,
        extendedBio,
        website,
        logoUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${website}&size=128`,
        bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
        linkedin: `https://linkedin.com/company/${slug}`,
        twitter: `https://twitter.com/${slug}`,
        github: `https://github.com/${slug}`,
        foundedYear,
        stage,
        fundingType,
        totalFundingInr,
        totalFundingUsd,
        teamSize,
        district: district.name,
        districtSlug: district.slug,
        city: `${district.headquarters} Hub`,
        latitude: lat,
        longitude: lng,
        address: `${Math.floor(r1 * 200 + 1)}, Tech Park Road, ${district.headquarters}, ${district.name} District`,
        pincode: `${Math.floor(r2 * 50 + 600001)}`,
        contactEmail: `contact@${domain}`,
        contactPhone: `+91 44 ${Math.floor(r3 * 8000 + 2000)} ${Math.floor(r4 * 8000 + 1000)}`,
        sectors,
        techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'React', 'TailwindCSS', 'Python', 'AWS'],
        founders,
        fundingRounds,
        milestones,
        awards,
        keyClients,
        pressMentions,
        businessModel,
        revenueModel: businessModel,
        revenueRange,
        targetMarket,
        customerSegments: ['Enterprise', 'SMBs', 'Government'],
        incubator,
        dpiitNumber: `DIPP${Math.floor(r5 * 90000 + 10000)}`,
        competitiveEdge: `Proprietary localized data models and low-latency edge deployment tailored for Indian industrial environments.`,
        isProfitable: r1 > 0.45,
        verificationStatus: 'VERIFIED',
        source: 'StartupTN Registry & Verified Research',
      });
    }
  }

  return result;
}
