export interface DistrictInfo {
  name: string;
  slug: string;
  headquarters: string;
  latitude: number;
  longitude: number;
  region: 'North' | 'South' | 'West' | 'Central' | 'Delta' | 'Chennai Region';
  primaryHubs: string[];
  keySectors: string[];
}

export const TN_DISTRICTS_DATA: Record<string, DistrictInfo> = {
  chennai: {
    name: 'Chennai',
    slug: 'chennai',
    headquarters: 'Chennai',
    latitude: 13.0827,
    longitude: 80.2707,
    region: 'Chennai Region',
    primaryHubs: ['Guindy', 'Tidel Park', 'IITM Research Park', 'T. Nagar', 'OMR', 'Nungambakkam', 'Adyar', 'Velachery', 'Perungudi'],
    keySectors: ['SaaS', 'AI', 'FinTech', 'HealthTech', 'DeepTech', 'SpaceTech', 'EdTech'],
  },
  coimbatore: {
    name: 'Coimbatore',
    slug: 'coimbatore',
    headquarters: 'Coimbatore',
    latitude: 11.0168,
    longitude: 76.9558,
    region: 'West',
    primaryHubs: ['Peelamedu', 'Gandhipuram', 'KCT Tech Park', 'Saravanampatti', 'Tidel Park Coimbatore', 'Eachanari', 'Kurichi'],
    keySectors: ['Manufacturing', 'IoT', 'EV', 'Agritech', 'SaaS', 'Robotics', 'BioTech'],
  },
  madurai: {
    name: 'Madurai',
    slug: 'madurai',
    headquarters: 'Madurai',
    latitude: 9.9252,
    longitude: 78.1198,
    region: 'South',
    primaryHubs: ['K.K. Nagar', 'Thirunagar', 'TCE Campus', 'Ilandhaikulam IT Park', 'Vadapalanji IT SEZ'],
    keySectors: ['Consumer', 'Agritech', 'EdTech', 'HealthTech', 'SaaS', 'D2C'],
  },
  tiruchirappalli: {
    name: 'Tiruchirappalli',
    slug: 'tiruchirappalli',
    headquarters: 'Tiruchirappalli',
    latitude: 10.7905,
    longitude: 78.7047,
    region: 'Central',
    primaryHubs: ['Thuvakudi (NIT Trichy)', 'Navalpattu IT Park', 'Thillai Nagar', 'Cantonment'],
    keySectors: ['DeepTech', 'EdTech', 'AI', 'Manufacturing', 'CleanTech'],
  },
  salem: {
    name: 'Salem',
    slug: 'salem',
    headquarters: 'Salem',
    latitude: 11.6643,
    longitude: 78.1460,
    region: 'West',
    primaryHubs: ['Suramangalam', 'Fairlands', 'Sona TBI Campus', 'Jagirammapalayam IT Park'],
    keySectors: ['Manufacturing', 'IoT', 'Mobility', 'HealthTech', 'Textiles'],
  },
  tiruppur: {
    name: 'Tiruppur',
    slug: 'tiruppur',
    headquarters: 'Tiruppur',
    latitude: 11.1085,
    longitude: 77.3411,
    region: 'West',
    primaryHubs: ['Avinashi Road', 'Kangeyam', 'Palladam', 'Uthukuli'],
    keySectors: ['Manufacturing', 'ClimateTech', 'Robotics', 'SaaS', 'Textiles'],
  },
  erode: {
    name: 'Erode',
    slug: 'erode',
    headquarters: 'Erode',
    latitude: 11.3410,
    longitude: 77.7172,
    region: 'West',
    primaryHubs: ['Perundurai (KEC-TBI)', 'Bhavani', 'Gobichettipalayam'],
    keySectors: ['Agritech', 'FoodTech', 'Manufacturing', 'IoT'],
  },
  krishnagiri: {
    name: 'Krishnagiri (Hosur)',
    slug: 'krishnagiri',
    headquarters: 'Krishnagiri',
    latitude: 12.5266,
    longitude: 78.2146,
    region: 'West',
    primaryHubs: ['Hosur SIPCOT I & II', 'Shoolagiri Future Mobility Park', 'Pochampalli', 'Bargur'],
    keySectors: ['EV', 'Robotics', 'Manufacturing', 'IoT', 'Aerospace'],
  },
  vellore: {
    name: 'Vellore',
    slug: 'vellore',
    headquarters: 'Vellore',
    latitude: 12.9165,
    longitude: 79.1325,
    region: 'North',
    primaryHubs: ['VIT Campus (VITTBI)', 'Katpadi', 'CMC Bagayam', 'Ranipet SIPCOT'],
    keySectors: ['HealthTech', 'DeepTech', 'AI', 'EdTech', 'BioTech'],
  },
  chengalpattu: {
    name: 'Chengalpattu',
    slug: 'chengalpattu',
    headquarters: 'Chengalpattu',
    latitude: 12.6841,
    longitude: 79.9836,
    region: 'Chennai Region',
    primaryHubs: ['Mahindra World City', 'Siruseri SIPCOT', 'Kattankulathur (SRM)', 'Vandalur (CIIC)', 'Padur'],
    keySectors: ['SaaS', 'DeepTech', 'Mobility', 'AI', 'BioTech', 'FinTech'],
  },
  kanchipuram: {
    name: 'Kanchipuram',
    slug: 'kanchipuram',
    headquarters: 'Kanchipuram',
    latitude: 12.8342,
    longitude: 79.7036,
    region: 'North',
    primaryHubs: ['Sriperumbudur Industrial Corridor', 'Oragadam Mega Auto Hub', 'Irungattukottai'],
    keySectors: ['Manufacturing', 'SpaceTech', 'IoT', 'EV', 'Automotive'],
  },
  tirunelveli: {
    name: 'Tirunelveli',
    slug: 'tirunelveli',
    headquarters: 'Tirunelveli',
    latitude: 8.7139,
    longitude: 77.7567,
    region: 'South',
    primaryHubs: ['Palayamkottai', 'Gangaikondan IT Park', 'FX TBI Campus', 'Nanguneri SEZ'],
    keySectors: ['ClimateTech', 'SaaS', 'EdTech', 'Renewable Energy'],
  },
  thanjavur: {
    name: 'Thanjavur',
    slug: 'thanjavur',
    headquarters: 'Thanjavur',
    latitude: 10.7870,
    longitude: 79.1378,
    region: 'Delta',
    primaryHubs: ['SASTRA FIRST Incubator', 'IIFPT Incubator', 'Periyar Maniammai TBI', 'Kumbakonam'],
    keySectors: ['Agritech', 'FoodTech', 'Consumer', 'DeepTech', 'IoT'],
  },
  thoothukudi: {
    name: 'Thoothukudi',
    slug: 'thoothukudi',
    headquarters: 'Thoothukudi',
    latitude: 8.7642,
    longitude: 78.1348,
    region: 'South',
    primaryHubs: ['Tuticorin Port Corridor', 'SIPCOT Industrial Complex', 'Kovilpatti'],
    keySectors: ['Mobility', 'ClimateTech', 'Manufacturing', 'Green Hydrogen', 'Blue Economy'],
  },
  kanyakumari: {
    name: 'Kanyakumari',
    slug: 'kanyakumari',
    headquarters: 'Nagercoil',
    latitude: 8.1834,
    longitude: 77.4119,
    region: 'South',
    primaryHubs: ['Nagercoil', 'Marthandam', 'Kanyakumari Coast', 'Chunkankadai'],
    keySectors: ['SaaS', 'EdTech', 'Consumer', 'TourismTech', 'Blue Economy'],
  },
  dindigul: {
    name: 'Dindigul',
    slug: 'dindigul',
    headquarters: 'Dindigul',
    latitude: 10.3673,
    longitude: 77.9803,
    region: 'South',
    primaryHubs: ['Dindigul Town', 'Palani', 'Oddanchatram Agri Market', 'Batlagundu'],
    keySectors: ['Agritech', 'Manufacturing', 'Consumer', 'Food Processing'],
  },
  namakkal: {
    name: 'Namakkal',
    slug: 'namakkal',
    headquarters: 'Namakkal',
    latitude: 11.2189,
    longitude: 78.1674,
    region: 'West',
    primaryHubs: ['Namakkal Town', 'Tiruchengode', 'Rasipuram', 'Paramathi Velur'],
    keySectors: ['Mobility', 'Agritech', 'IoT', 'Logistics', 'PoultryTech'],
  },
  virudhunagar: {
    name: 'Virudhunagar',
    slug: 'virudhunagar',
    headquarters: 'Virudhunagar',
    latitude: 9.5680,
    longitude: 77.9624,
    region: 'South',
    primaryHubs: ['Sivakasi Printing & Packaging Cluster', 'Rajapalayam', 'Aruppukkottai', 'Kalasalingam TBI'],
    keySectors: ['Manufacturing', 'Consumer', 'FinTech', 'PackagingTech', 'SafetyTech'],
  },
  karur: {
    name: 'Karur',
    slug: 'karur',
    headquarters: 'Karur',
    latitude: 10.9601,
    longitude: 78.0766,
    region: 'Central',
    primaryHubs: ['Karur Textile Park', 'Vengamedu', 'Kulithalai'],
    keySectors: ['Manufacturing', 'ClimateTech', 'Sustainable Textiles', 'ExportTech'],
  },
  nilgiris: {
    name: 'Nilgiris',
    slug: 'nilgiris',
    headquarters: 'Udhagamandalam (Ooty)',
    latitude: 11.4102,
    longitude: 76.6950,
    region: 'West',
    primaryHubs: ['Ooty', 'Coonoor Tea Tech Cluster', 'Kotagiri', 'Gudalur'],
    keySectors: ['Agritech', 'ClimateTech', 'Consumer', 'Specialty Tea', 'EcoTourism'],
  },
  cuddalore: {
    name: 'Cuddalore',
    slug: 'cuddalore',
    headquarters: 'Cuddalore',
    latitude: 11.7480,
    longitude: 79.7714,
    region: 'Central',
    primaryHubs: ['Cuddalore Port SIPCOT', 'Neyveli Lignite Green Tech', 'Chidambaram (Annamalai University)'],
    keySectors: ['ClimateTech', 'Agritech', 'Bio-Chemicals', 'Clean Energy'],
  },
  dharmapuri: {
    name: 'Dharmapuri',
    slug: 'dharmapuri',
    headquarters: 'Dharmapuri',
    latitude: 12.1211,
    longitude: 78.1582,
    region: 'West',
    primaryHubs: ['Dharmapuri Town', 'Harur', 'Palacode Agro Cluster'],
    keySectors: ['Agritech', 'FoodTech', 'Horticulture Tech', 'Sericulture Tech'],
  },
  kallakurichi: {
    name: 'Kallakurichi',
    slug: 'kallakurichi',
    headquarters: 'Kallakurichi',
    latitude: 11.7384,
    longitude: 78.9639,
    region: 'Central',
    primaryHubs: ['Kallakurichi Town', 'Ulundurpet', 'Chinnasalem'],
    keySectors: ['Agritech', 'Manufacturing', 'Bio-Energy', 'Rice Milling Automation'],
  },
  mayiladuthurai: {
    name: 'Mayiladuthurai',
    slug: 'mayiladuthurai',
    headquarters: 'Mayiladuthurai',
    latitude: 11.1075,
    longitude: 79.6524,
    region: 'Delta',
    primaryHubs: ['Mayiladuthurai Town', 'Sirkazhi', 'Tharangambadi Marine Tech Hub'],
    keySectors: ['Agritech', 'Consumer', 'Aquaculture Tech', 'HeritageTech'],
  },
  nagapattinam: {
    name: 'Nagapattinam',
    slug: 'nagapattinam',
    headquarters: 'Nagapattinam',
    latitude: 10.7672,
    longitude: 79.8449,
    region: 'Delta',
    primaryHubs: ['Nagapattinam Port', 'Velankanni', 'TNJFU Fisheries Incubator'],
    keySectors: ['Agritech', 'ClimateTech', 'Fisheries Tech', 'Marine Aquaculture'],
  },
  perambalur: {
    name: 'Perambalur',
    slug: 'perambalur',
    headquarters: 'Perambalur',
    latitude: 11.2342,
    longitude: 78.8820,
    region: 'Central',
    primaryHubs: ['Perambalur SEZ', 'Padalur Industrial Park', 'Kunnam'],
    keySectors: ['Agritech', 'Manufacturing', 'Cotton Tech', 'Food Processing'],
  },
  pudukkottai: {
    name: 'Pudukkottai',
    slug: 'pudukkottai',
    headquarters: 'Pudukkottai',
    latitude: 10.3797,
    longitude: 78.8208,
    region: 'Central',
    primaryHubs: ['Pudukkottai Town', 'Viralimalai Industrial Hub', 'Aranthangi'],
    keySectors: ['Manufacturing', 'Agritech', 'Stone Crafting Tech', 'Food Processing'],
  },
  ramanathapuram: {
    name: 'Ramanathapuram',
    slug: 'ramanathapuram',
    headquarters: 'Ramanathapuram',
    latitude: 9.3639,
    longitude: 78.8395,
    region: 'South',
    primaryHubs: ['Ramanathapuram Town', 'Paramakudi', 'Rameswaram Marine Hub', 'Kamuthi Solar Park'],
    keySectors: ['ClimateTech', 'Agritech', 'Solar Energy', 'Seaweed Farming Tech', 'Desalination Tech'],
  },
  ranipet: {
    name: 'Ranipet',
    slug: 'ranipet',
    headquarters: 'Ranipet',
    latitude: 12.9271,
    longitude: 79.3331,
    region: 'North',
    primaryHubs: ['Ranipet SIPCOT Heavy Engineering', 'Arakkonam Logistics Park', 'Walajapet'],
    keySectors: ['Manufacturing', 'ClimateTech', 'Heavy Engineering', 'Green Leather Tech'],
  },
  sivaganga: {
    name: 'Sivaganga',
    slug: 'sivaganga',
    headquarters: 'Sivaganga',
    latitude: 9.8433,
    longitude: 78.4809,
    region: 'South',
    primaryHubs: ['Karaikudi (CECRI & Alagappa University)', 'Devakottai', 'Manamadurai'],
    keySectors: ['DeepTech', 'Consumer', 'Electro-Chemistry', 'Graphite Tech', 'Chettinad Crafts D2C'],
  },
  tenkasi: {
    name: 'Tenkasi',
    slug: 'tenkasi',
    headquarters: 'Tenkasi',
    latitude: 8.9594,
    longitude: 77.3161,
    region: 'South',
    primaryHubs: ['Tenkasi Town', 'Mathalamparai (Zoho Campus)', 'Courtallam', 'Sankarankovil'],
    keySectors: ['SaaS', 'EdTech', 'AI', 'Rural Tech Development', 'CleanTech'],
  },
  theni: {
    name: 'Theni',
    slug: 'theni',
    headquarters: 'Theni',
    latitude: 10.0104,
    longitude: 77.4768,
    region: 'South',
    primaryHubs: ['Theni Allinagaram', 'Periyakulam TNAU Horticultural College', 'Bodinayakanur Cardamom Hub', 'Cumbum Valley'],
    keySectors: ['Agritech', 'Consumer', 'Spice Processing Tech', 'Cold Chain Tech'],
  },
  tirupathur: {
    name: 'Tirupathur',
    slug: 'tirupathur',
    headquarters: 'Tirupathur',
    latitude: 12.4958,
    longitude: 78.5678,
    region: 'North',
    primaryHubs: ['Tirupathur Town', 'Vaniyambadi Leather Cluster', 'Ambur Footwear Tech Hub', 'Yelagiri Eco Hub'],
    keySectors: ['Agritech', 'Manufacturing', 'Footwear Tech', 'Forest Produce Tech'],
  },
  tiruvallur: {
    name: 'Tiruvallur',
    slug: 'tiruvallur',
    headquarters: 'Tiruvallur',
    latitude: 13.1432,
    longitude: 79.9083,
    region: 'Chennai Region',
    primaryHubs: ['Gummidipoondi SIPCOT', 'Avadi (Vel Tech TBI)', 'Thirumazhisai Auto Hub', 'Ponneri Smart City'],
    keySectors: ['Manufacturing', 'EV', 'IoT', 'Automotive Components', 'DefenseTech'],
  },
  tiruvannamalai: {
    name: 'Tiruvannamalai',
    slug: 'tiruvannamalai',
    headquarters: 'Tiruvannamalai',
    latitude: 12.2253,
    longitude: 79.0747,
    region: 'North',
    primaryHubs: ['Tiruvannamalai Town', 'Arani Silk Tech Cluster', 'Cheyyar SIPCOT Mega SEZ', 'Polur'],
    keySectors: ['Agritech', 'Consumer', 'Textile Innovation', 'Solar Energy', 'Dairy Tech'],
  },
  tiruvarur: {
    name: 'Tiruvarur',
    slug: 'tiruvarur',
    headquarters: 'Tiruvarur',
    latitude: 10.7725,
    longitude: 79.6365,
    region: 'Delta',
    primaryHubs: ['Tiruvarur Town', 'Neelakudi (Central University CUTN)', 'Mannargudi'],
    keySectors: ['Agritech', 'EdTech', 'Delta Agro Innovations', 'Bio-Fertilizers'],
  },
  viluppuram: {
    name: 'Viluppuram',
    slug: 'viluppuram',
    headquarters: 'Viluppuram',
    latitude: 11.9401,
    longitude: 79.4861,
    region: 'Central',
    primaryHubs: ['Viluppuram Town', 'Tindivanam SIPCOT Food Park', 'Gingee'],
    keySectors: ['Agritech', 'ClimateTech', 'Bio-Fuels', 'Cashew Tech', 'Food Processing'],
  },
  ariyalur: {
    name: 'Ariyalur',
    slug: 'ariyalur',
    headquarters: 'Ariyalur',
    latitude: 11.1401,
    longitude: 79.0786,
    region: 'Central',
    primaryHubs: ['Ariyalur Town', 'Jayankondam Lignite & Green Power Hub', 'Sendurai'],
    keySectors: ['Manufacturing', 'DeepTech', 'Cement Industry Tech', 'Limestone Mining Tech', 'Fossil Conservation Tech'],
  },
};

export function normalizeDistrict(input: string): { name: string; slug: string; latitude: number; longitude: number } {
  if (!input) return { name: 'Chennai', slug: 'chennai', latitude: 13.0827, longitude: 80.2707 };
  const clean = input.toLowerCase().trim();

  // Explicit district alias mapping
  if (clean.includes('chennai') || clean.includes('madras') || clean.includes('guindy') || clean.includes('omr') || clean.includes('tidel')) {
    return { name: 'Chennai', slug: 'chennai', latitude: 13.0827, longitude: 80.2707 };
  }
  if (clean.includes('coimbatore') || clean.includes('kovai') || clean.includes('peelamedu') || clean.includes('saravanampatti')) {
    return { name: 'Coimbatore', slug: 'coimbatore', latitude: 11.0168, longitude: 76.9558 };
  }
  if (clean.includes('madurai')) {
    return { name: 'Madurai', slug: 'madurai', latitude: 9.9252, longitude: 78.1198 };
  }
  if (clean.includes('tiruchirappalli') || clean.includes('trichy') || clean.includes('thuvakudi')) {
    return { name: 'Tiruchirappalli', slug: 'tiruchirappalli', latitude: 10.7905, longitude: 78.7047 };
  }
  if (clean.includes('salem')) {
    return { name: 'Salem', slug: 'salem', latitude: 11.6643, longitude: 78.1460 };
  }
  if (clean.includes('tiruppur') || clean.includes('tirupur') || clean.includes('palladam') || clean.includes('kangeyam')) {
    return { name: 'Tiruppur', slug: 'tiruppur', latitude: 11.1085, longitude: 77.3411 };
  }
  if (clean.includes('erode') || clean.includes('perundurai') || clean.includes('bhavani') || clean.includes('gobichettipalayam')) {
    return { name: 'Erode', slug: 'erode', latitude: 11.3410, longitude: 77.7172 };
  }
  if (clean.includes('hosur') || clean.includes('krishnagiri') || clean.includes('shoolagiri') || clean.includes('pochampalli')) {
    return { name: 'Krishnagiri (Hosur)', slug: 'krishnagiri', latitude: 12.5266, longitude: 78.2146 };
  }
  if (clean.includes('vellore') || clean.includes('katpadi')) {
    return { name: 'Vellore', slug: 'vellore', latitude: 12.9165, longitude: 79.1325 };
  }
  if (clean.includes('chengalpattu') || clean.includes('siruseri') || clean.includes('vandalur') || clean.includes('kattankulathur') || clean.includes('mahindra world city') || clean.includes('padur')) {
    return { name: 'Chengalpattu', slug: 'chengalpattu', latitude: 12.6841, longitude: 79.9836 };
  }
  if (clean.includes('kanchipuram') || clean.includes('kancheepuram') || clean.includes('sriperumbudur') || clean.includes('oragadam')) {
    return { name: 'Kanchipuram', slug: 'kanchipuram', latitude: 12.8342, longitude: 79.7036 };
  }
  if (clean.includes('tirunelveli') || clean.includes('palayamkottai') || clean.includes('gangaikondan')) {
    return { name: 'Tirunelveli', slug: 'tirunelveli', latitude: 8.7139, longitude: 77.7567 };
  }
  if (clean.includes('thanjavur') || clean.includes('tanjore') || clean.includes('kumbakonam')) {
    return { name: 'Thanjavur', slug: 'thanjavur', latitude: 10.7870, longitude: 79.1378 };
  }
  if (clean.includes('thoothukudi') || clean.includes('tuticorin') || clean.includes('kovilpatti')) {
    return { name: 'Thoothukudi', slug: 'thoothukudi', latitude: 8.7642, longitude: 78.1348 };
  }
  if (clean.includes('kanyakumari') || clean.includes('kanniyakumari') || clean.includes('nagercoil') || clean.includes('marthandam')) {
    return { name: 'Kanyakumari', slug: 'kanyakumari', latitude: 8.1834, longitude: 77.4119 };
  }
  if (clean.includes('dindigul') || clean.includes('palani') || clean.includes('oddanchatram')) {
    return { name: 'Dindigul', slug: 'dindigul', latitude: 10.3673, longitude: 77.9803 };
  }
  if (clean.includes('namakkal') || clean.includes('tiruchengode') || clean.includes('rasipuram')) {
    return { name: 'Namakkal', slug: 'namakkal', latitude: 11.2189, longitude: 78.1674 };
  }
  if (clean.includes('virudhunagar') || clean.includes('sivakasi') || clean.includes('rajapalayam') || clean.includes('aruppukkottai')) {
    return { name: 'Virudhunagar', slug: 'virudhunagar', latitude: 9.5680, longitude: 77.9624 };
  }
  if (clean.includes('karur') || clean.includes('kulithalai')) {
    return { name: 'Karur', slug: 'karur', latitude: 10.9601, longitude: 78.0766 };
  }
  if (clean.includes('nilgiris') || clean.includes('ooty') || clean.includes('coonoor') || clean.includes('kotagiri')) {
    return { name: 'Nilgiris', slug: 'nilgiris', latitude: 11.4102, longitude: 76.6950 };
  }
  if (clean.includes('cuddalore') || clean.includes('neyveli') || clean.includes('chidambaram')) {
    return { name: 'Cuddalore', slug: 'cuddalore', latitude: 11.7480, longitude: 79.7714 };
  }
  if (clean.includes('dharmapuri') || clean.includes('palacode') || clean.includes('harur')) {
    return { name: 'Dharmapuri', slug: 'dharmapuri', latitude: 12.1211, longitude: 78.1582 };
  }
  if (clean.includes('kallakurichi') || clean.includes('ulundurpet') || clean.includes('chinnasalem')) {
    return { name: 'Kallakurichi', slug: 'kallakurichi', latitude: 11.7384, longitude: 78.9639 };
  }
  if (clean.includes('mayiladuthurai') || clean.includes('sirkazhi') || clean.includes('tharangambadi')) {
    return { name: 'Mayiladuthurai', slug: 'mayiladuthurai', latitude: 11.1075, longitude: 79.6524 };
  }
  if (clean.includes('nagapattinam') || clean.includes('velankanni')) {
    return { name: 'Nagapattinam', slug: 'nagapattinam', latitude: 10.7672, longitude: 79.8449 };
  }
  if (clean.includes('perambalur') || clean.includes('kunnam')) {
    return { name: 'Perambalur', slug: 'perambalur', latitude: 11.2342, longitude: 78.8820 };
  }
  if (clean.includes('pudukkottai') || clean.includes('viralimalai') || clean.includes('aranthangi')) {
    return { name: 'Pudukkottai', slug: 'pudukkottai', latitude: 10.3797, longitude: 78.8208 };
  }
  if (clean.includes('ramanathapuram') || clean.includes('rameswaram') || clean.includes('paramakudi') || clean.includes('kamuthi')) {
    return { name: 'Ramanathapuram', slug: 'ramanathapuram', latitude: 9.3639, longitude: 78.8395 };
  }
  if (clean.includes('ranipet') || clean.includes('arakkonam') || clean.includes('walajapet')) {
    return { name: 'Ranipet', slug: 'ranipet', latitude: 12.9271, longitude: 79.3331 };
  }
  if (clean.includes('sivaganga') || clean.includes('karaikudi') || clean.includes('devakottai') || clean.includes('manamadurai')) {
    return { name: 'Sivaganga', slug: 'sivaganga', latitude: 9.8433, longitude: 78.4809 };
  }
  if (clean.includes('tenkasi') || clean.includes('courtallam') || clean.includes('sankarankovil')) {
    return { name: 'Tenkasi', slug: 'tenkasi', latitude: 8.9594, longitude: 77.3161 };
  }
  if (clean.includes('theni') || clean.includes('periyakulam') || clean.includes('bodinayakanur') || clean.includes('cumbum')) {
    return { name: 'Theni', slug: 'theni', latitude: 10.0104, longitude: 77.4768 };
  }
  if (clean.includes('tirupathur') || clean.includes('vaniyambadi') || clean.includes('ambur') || clean.includes('yelagiri')) {
    return { name: 'Tirupathur', slug: 'tirupathur', latitude: 12.4958, longitude: 78.5678 };
  }
  if (clean.includes('tiruvallur') || clean.includes('thiruvallur') || clean.includes('gummidipoondi') || clean.includes('avadi') || clean.includes('thirumazhisai')) {
    return { name: 'Tiruvallur', slug: 'tiruvallur', latitude: 13.1432, longitude: 79.9083 };
  }
  if (clean.includes('tiruvannamalai') || clean.includes('thiruvannamalai') || clean.includes('arani') || clean.includes('cheyyar')) {
    return { name: 'Tiruvannamalai', slug: 'tiruvannamalai', latitude: 12.2253, longitude: 79.0747 };
  }
  if (clean.includes('tiruvarur') || clean.includes('thiruvarur') || clean.includes('mannargudi')) {
    return { name: 'Tiruvarur', slug: 'tiruvarur', latitude: 10.7725, longitude: 79.6365 };
  }
  if (clean.includes('viluppuram') || clean.includes('villupuram') || clean.includes('tindivanam') || clean.includes('gingee')) {
    return { name: 'Viluppuram', slug: 'viluppuram', latitude: 11.9401, longitude: 79.4861 };
  }
  if (clean.includes('ariyalur') || clean.includes('jayankondam') || clean.includes('sendurai')) {
    return { name: 'Ariyalur', slug: 'ariyalur', latitude: 11.1401, longitude: 79.0786 };
  }

  // Fallback to Chennai
  return { name: 'Chennai', slug: 'chennai', latitude: 13.0827, longitude: 80.2707 };
}
