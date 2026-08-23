export interface SectorTaxonomy {
  sector: string;
  subSector: string;
  industry: string;
  defaultTechnologies: string[];
}

export const SECTOR_TAXONOMY_MAP: Record<string, SectorTaxonomy> = {
  // AI & ML
  'ai': { sector: 'AI', subSector: 'Machine Learning', industry: 'Enterprise Tech', defaultTechnologies: ['Python', 'PyTorch', 'Computer Vision', 'LLM'] },
  'artificial intelligence': { sector: 'AI', subSector: 'Computer Vision', industry: 'Enterprise Tech', defaultTechnologies: ['Neural Networks', 'OpenCV', 'Deep Learning'] },
  'genai': { sector: 'AI', subSector: 'Generative AI', industry: 'Enterprise Tech', defaultTechnologies: ['Transformers', 'RAG', 'Vector Search'] },

  // SaaS
  'saas': { sector: 'SaaS', subSector: 'B2B Software', industry: 'Information Technology', defaultTechnologies: ['Cloud Native', 'Node.js', 'PostgreSQL', 'React'] },
  'enterprise saas': { sector: 'SaaS', subSector: 'Enterprise Workflow', industry: 'Information Technology', defaultTechnologies: ['CRM', 'ERP Automation', 'APIs'] },
  'crm': { sector: 'SaaS', subSector: 'Customer Relationship Management', industry: 'Sales & Marketing Tech', defaultTechnologies: ['Cloud SaaS', 'Multi-tenant DB'] },

  // FinTech
  'fintech': { sector: 'FinTech', subSector: 'Digital Payments', industry: 'Financial Services', defaultTechnologies: ['UPI Integration', 'Banking APIs', 'Fraud Detection'] },
  'neobanking': { sector: 'FinTech', subSector: 'Digital Banking', industry: 'Financial Services', defaultTechnologies: ['Core Banking Engine', 'Microservices'] },
  'lending': { sector: 'FinTech', subSector: 'Credit & Lending Tech', industry: 'Financial Services', defaultTechnologies: ['Credit Scoring ML', 'eKYC'] },

  // HealthTech & BioTech
  'healthtech': { sector: 'HealthTech', subSector: 'Digital Diagnostics', industry: 'Healthcare', defaultTechnologies: ['Medical Imaging AI', 'Telemedicine', 'IoT Devices'] },
  'medtech': { sector: 'HealthTech', subSector: 'Medical Devices', industry: 'Healthcare', defaultTechnologies: ['Biomedical Sensors', 'Embedded C', 'Hardware Prototyping'] },
  'biotech': { sector: 'BioTech', subSector: 'Industrial Biotechnology', industry: 'Life Sciences', defaultTechnologies: ['Enzyme Engineering', 'Fermentation Tech', 'Bio-analytics'] },

  // DeepTech & SpaceTech & Robotics
  'deeptech': { sector: 'DeepTech', subSector: 'Advanced Engineering', industry: 'Hard Tech', defaultTechnologies: ['Embedded RTOS', 'Physics Simulation', 'Hardware R&D'] },
  'spacetech': { sector: 'SpaceTech', subSector: 'Launch Vehicles & Satellite Tech', industry: 'Aerospace', defaultTechnologies: ['3D Additive Propulsion', 'Avionics', 'Orbital Mechanics'] },
  'robotics': { sector: 'DeepTech', subSector: 'Industrial Robotics', industry: 'Automation', defaultTechnologies: ['ROS2', 'Computer Vision', 'LIDAR SLAM'] },
  'drones': { sector: 'DeepTech', subSector: 'Unmanned Aerial Vehicles', industry: 'Aerospace & Defense', defaultTechnologies: ['Autonomous Navigation', 'Drone Avionics', 'Telemetry'] },

  // EV & Mobility & Logistics
  'ev': { sector: 'EV', subSector: 'Electric Vehicles & Powertrain', industry: 'Automotive & Clean Mobility', defaultTechnologies: ['BMS', 'Lithium-ion Telematics', 'CAN Bus'] },
  'mobility': { sector: 'Mobility', subSector: 'Fleet Logistics & Urban Transport', industry: 'Transportation', defaultTechnologies: ['GPS Tracking', 'Route Optimization AI', 'Telematics'] },
  'logistics': { sector: 'Mobility', subSector: 'Supply Chain Tech', industry: 'Transportation & Logistics', defaultTechnologies: ['Warehouse Automation', 'RFID', 'Cold Chain IoT'] },

  // Agritech & FoodTech
  'agritech': { sector: 'Agritech', subSector: 'Precision Agriculture', industry: 'Agriculture', defaultTechnologies: ['Soil Sensors', 'Satellite Imagery Analysis', 'IoT Smart Irrigation'] },
  'foodtech': { sector: 'FoodTech', subSector: 'Sustainable Food Processing', industry: 'Food & Nutrition', defaultTechnologies: ['Vacuum Freeze Drying', 'Nutraceutical Formulations'] },
  'aquaculture': { sector: 'Agritech', subSector: 'Marine Aquaculture Tech', industry: 'Fisheries', defaultTechnologies: ['Water Quality Sensors', 'Automated Feeders'] },

  // ClimateTech & Clean Energy
  'climatetech': { sector: 'ClimateTech', subSector: 'Renewable Energy & Waste Management', industry: 'Sustainability & CleanTech', defaultTechnologies: ['Bio-CNG Fermentation', 'Solar IoT', 'Carbon Accounting'] },
  'cleantech': { sector: 'ClimateTech', subSector: 'Water Treatment & Recycling', industry: 'Environmental Engineering', defaultTechnologies: ['Reverse Osmosis Automation', 'Zero Liquid Discharge'] },

  // Manufacturing & Industry 4.0
  'manufacturing': { sector: 'Manufacturing', subSector: 'Smart Industry 4.0', industry: 'Industrial Automation', defaultTechnologies: ['PLC Automation', 'SCADA', 'Digital Twin', '3D Printing'] },
  'textiletech': { sector: 'Manufacturing', subSector: 'Sustainable Textiles & Dyeing Tech', industry: 'Textiles & Apparel', defaultTechnologies: ['Waterless Dyeing', 'Circular Fabric Tech', 'Automated Loom Sensors'] },

  // EdTech
  'edtech': { sector: 'EdTech', subSector: 'Vernacular Learning & Upskilling', industry: 'Education', defaultTechnologies: ['Interactive LMS', 'Gamified Assessment', 'Vernacular NLP'] },

  // Consumer & D2C
  'consumer': { sector: 'Consumer', subSector: 'Direct to Consumer (D2C)', industry: 'Consumer Goods & Retail', defaultTechnologies: ['E-Commerce Engine', 'Omnichannel Fulfillment'] },
  'd2c': { sector: 'Consumer', subSector: 'Direct to Consumer Brands', industry: 'Retail & FMCG', defaultTechnologies: ['Shopify/Headless Storefront', 'CRM'] },
};

export function normalizeSector(rawSector: string, rawDescription?: string): SectorTaxonomy {
  if (!rawSector && !rawDescription) {
    return {
      sector: 'SaaS',
      subSector: 'B2B Software',
      industry: 'Information Technology',
      defaultTechnologies: ['Cloud Native', 'Node.js', 'React'],
    };
  }

  const text = `${rawSector || ''} ${rawDescription || ''}`.toLowerCase();

  for (const [key, mapping] of Object.entries(SECTOR_TAXONOMY_MAP)) {
    if (text.includes(key)) {
      return mapping;
    }
  }

  // Common keyword fallbacks
  if (text.includes('space') || text.includes('rocket') || text.includes('satellite') || text.includes('propulsion')) {
    return SECTOR_TAXONOMY_MAP['spacetech'];
  }
  if (text.includes('battery') || text.includes('electric vehicle') || text.includes('e-bike') || text.includes('charging') || text.includes('scooter')) {
    return SECTOR_TAXONOMY_MAP['ev'];
  }
  if (text.includes('health') || text.includes('hospital') || text.includes('medical') || text.includes('doctor') || text.includes('clinic') || text.includes('pharma')) {
    return SECTOR_TAXONOMY_MAP['healthtech'];
  }
  if (text.includes('farm') || text.includes('crop') || text.includes('agri') || text.includes('farmer') || text.includes('soil') || text.includes('organic')) {
    return SECTOR_TAXONOMY_MAP['agritech'];
  }
  if (text.includes('school') || text.includes('student') || text.includes('learn') || text.includes('skill') || text.includes('college') || text.includes('course')) {
    return SECTOR_TAXONOMY_MAP['edtech'];
  }
  if (text.includes('solar') || text.includes('waste') || text.includes('recycle') || text.includes('green') || text.includes('bio-cng') || text.includes('carbon')) {
    return SECTOR_TAXONOMY_MAP['climatetech'];
  }
  if (text.includes('drone') || text.includes('uav') || text.includes('sensor') || text.includes('underwater') || text.includes('robot')) {
    return SECTOR_TAXONOMY_MAP['deeptech'];
  }
  if (text.includes('textile') || text.includes('cotton') || text.includes('garment') || text.includes('apparel') || text.includes('fabric')) {
    return SECTOR_TAXONOMY_MAP['textiletech'];
  }
  if (text.includes('ai') || text.includes('vision') || text.includes('algorithm') || text.includes('nlp') || text.includes('deep learning')) {
    return SECTOR_TAXONOMY_MAP['ai'];
  }

  return {
    sector: 'SaaS',
    subSector: 'Enterprise Software',
    industry: 'Technology',
    defaultTechnologies: ['Cloud Native', 'Web Applications'],
  };
}
