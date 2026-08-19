import { BlogPost } from '../../models/BlogPost.js';

export const INITIAL_BLOGS: BlogPost[] = [
  // 1. Founder Story - AgniKul Cosmos
  {
    id: 'blog_agnikul_launch_01',
    slug: 'building-worlds-first-3d-printed-single-piece-rocket-engine-in-chennai',
    title: 'Building the World’s First 3D-Printed Single-Piece Rocket Engine at IIT Madras',
    subtitle: 'How our Chennai-based aerospace team designed, manufactured, and hot-fired the Agnilet semi-cryogenic engine.',
    category: 'Founder Stories',
    coverImageUrl: 'https://images.unsplash.com/photo-1517976487588-4663b6528823?auto=format&fit=crop&w=1600&q=80',
    tags: ['DeepTech', 'SpaceTech', 'AdditiveManufacturing', 'IITMadras', 'Aerospace'],
    authorId: 'usr_fnd_4h8m2n9x6y1v7k',
    authorName: 'Srinath Ravichandran',
    authorRole: 'Co-Founder & CEO, AgniKul Cosmos',
    authorEmail: 'srinath@agnikul.in',
    isFounder: true,
    startupId: 'stp-agnikul',
    startupName: 'AgniKul Cosmos',
    startupSlug: 'agnikul-cosmos',
    status: 'PUBLISHED',
    featured: true,
    clapsCount: 384,
    readTimeMinutes: 6,
    publishedAt: '2025-02-10T10:00:00.000Z',
    isDeleted: false,
    content: `
### The Genesis of AgniKul Cosmos

When Moin and I founded AgniKul Cosmos at the **IIT Madras Research Park** in 2017, we asked ourselves a fundamental question: *Why does launching a small satellite into low Earth orbit require months of preparation and thousands of moving parts?*

Traditional rocket engines are intricate marvels of engineering with hundreds of individual components—manifolds, injectors, cooling jackets, and combustion chambers—all welded, brazed, and inspected over months. We realized that by leveraging additive manufacturing (3D printing), we could consolidate all of these components into a single, contiguous piece of aerospace-grade nickel alloy.

---

### The Agnilet Breakthrough

In 2021, we successfully test-fired the **Agnilet** engine at the Vikram Sarabhai Space Centre (VSSC). Agnilet is a semi-cryogenic rocket engine designed to generate approximately 3 to 4 kN of thrust at sea level, powered by liquid oxygen (LOX) and aviation turbine fuel (ATF).

> "The true superpower of additive manufacturing isn't just speed; it is the freedom to design cooling channels and injector geometries that were previously impossible to machine with traditional subtractive CNC tools."

#### Key Architectural Innovations:
1. **Single-Piece Consolidation**: Zero welds or seams across the entire combustion chamber and injector head.
2. **Integrated Regenerative Cooling Channels**: Liquid fuel circulates through micro-channels within the chamber wall before injection, absorbing intense thermal energy.
3. **Customizable Thrust Profiles**: We can print a tailored engine configuration for a specific customer payload within 72 hours.

---

### Why Tamil Nadu is India's SpaceTech Heartland

Building high-precision aerospace hardware requires a world-class manufacturing ecosystem. Tamil Nadu provides:
- **Academic R&D Power**: Direct collaboration with the National Centre for Combustion Research and Development (NCCRD) at IIT Madras.
- **Precision Tooling & Defense Corridor**: Access to specialized machining, precision foundries, and heat-treatment facilities across Chennai, Coimbatore, and Salem.
- **Proximity to Launch Hubs**: Strategically located for testing and eventual integration with ISRO's spaceport facilities.

Our mission is to ensure that going to space is as accessible and dependable as booking an on-demand cab. To fellow founders in Tamil Nadu: the talent, infrastructure, and institutional support here are second to none.
    `.trim(),
    createdAt: '2025-02-10T10:00:00.000Z',
    updatedAt: '2025-02-10T10:00:00.000Z',
  },

  // 2. DeepTech Insights - Chennai SaaS
  {
    id: 'blog_chennai_saas_02',
    slug: 'the-saas-capital-of-india-why-chennai-dominates-global-enterprise-software',
    title: 'The SaaS Capital of India: How Chennai Built a $50B+ Enterprise Software Corridor',
    subtitle: 'From Zoho and Freshworks to Chargebee and Kissflow—analyzing the playbook behind Tamil Nadu’s SaaS flywheel.',
    category: 'DeepTech Insights',
    coverImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
    tags: ['SaaS', 'Chennai', 'Bootstrapping', 'GlobalSoftware', 'Enterprise'],
    authorId: 'usr_adm_9x7k2p8w1m4q3v',
    authorName: 'Tamil Nadu Startup Mission',
    authorRole: 'Ecosystem Editorial Team',
    authorEmail: 'admin@tnstartupmap.in',
    isFounder: false,
    status: 'PUBLISHED',
    featured: true,
    clapsCount: 420,
    readTimeMinutes: 5,
    publishedAt: '2025-02-14T08:30:00.000Z',
    isDeleted: false,
    content: `
### Chennai's Trillion-Dollar Software Legacy

Chennai is widely recognized as the **SaaS Capital of India**. The city's enterprise software companies serve millions of businesses across North America, Europe, Asia-Pacific, and Latin America.

What makes the Chennai SaaS corridor unique compared to Silicon Valley or Bengaluru?

---

### The 4 Pillars of the Chennai SaaS Flywheel

#### 1. Frugal Engineering & Capital Efficiency
Unlike Silicon Valley's hyper-burn model, Chennai founders popularized the **capital-efficient SaaS playbook**. Companies like Zoho operated bootstrapped for decades, achieving billion-dollar recurring revenue with industry-leading profit margins.

#### 2. The Product-Led Growth Mastery
Chennai-built platforms mastered inside-sales and self-serve onboarding before Product-Led Growth (PLG) was coined as an industry buzzword. Global SMBs and enterprises adopt tools built along Old Mahabalipuram Road (OMR) without needing field sales reps on the ground.

#### 3. Deep Talent Pool & Low Churn
Tamil Nadu produces more engineering graduates per year than any other Indian state. Software engineers in Chennai demonstrate lower attrition rates and deeper product domain expertise in CRM, billing, payroll, and workflow automation.

#### 4. The Mafia Network Effect
The success of early giants spawned hundreds of next-generation startups founded by former employees:
- **Zoho Alumni**: Founded Freshworks, Chargebee, Vtiger, and dozens more.
- **Freshworks Alumni**: Launching AI-first customer support, dev tools, and cybersecurity ventures across the state.
    `.trim(),
    createdAt: '2025-02-14T08:30:00.000Z',
    updatedAt: '2025-02-14T08:30:00.000Z',
  },

  // 3. Ecosystem News - EV Corridor
  {
    id: 'blog_ev_hosur_03',
    slug: 'hosur-coimbatore-the-clean-mobility-ev-manufacturing-epicenter',
    title: 'Hosur & Coimbatore: How Western Tamil Nadu Became India’s EV Manufacturing Epicenter',
    subtitle: 'From Ather and Ola to precision battery pack manufacturers and motor foundries in the Kongu belt.',
    category: 'Ecosystem News',
    coverImageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
    tags: ['EV', 'CleanTech', 'Manufacturing', 'Hosur', 'Coimbatore'],
    authorId: 'usr_adm_9x7k2p8w1m4q3v',
    authorName: 'Tamil Nadu Startup Mission',
    authorRole: 'Ecosystem Editorial Team',
    authorEmail: 'admin@tnstartupmap.in',
    isFounder: false,
    status: 'PUBLISHED',
    featured: true,
    clapsCount: 295,
    readTimeMinutes: 4,
    publishedAt: '2025-02-18T14:00:00.000Z',
    isDeleted: false,
    content: `
### The Automotive Transition to Electric Mobility

Tamil Nadu accounts for over **40% of all electric two-wheelers manufactured in India**. The industrial corridor stretching from Hosur and Krishnagiri through Salem to Coimbatore and Tiruppur has become the epicenter of clean mobility hardware.

---

### Key Drivers of the EV Boom:

1. **Integrated Auto-Component Supply Chain**: Over 500 tier-1 and tier-2 auto component suppliers in Coimbatore and Hosur pivoted to precision EV motors, lightweight chassis, wire harnesses, and thermal management systems.
2. **State Government Policy Incentives**: The Tamil Nadu EV Policy provides capital subsidies, electricity tax exemptions, and specialized EV parks in SIPCOT industrial hubs.
3. **Advanced Battery Assembly**: High-capacity gigafactories and pack assembly lines operating near Hosur benefit from rapid logistics connectivity to Bangalore and Chennai ports.

Tamil Nadu is not just participating in the EV transition—it is manufacturing the vehicles that power it.
    `.trim(),
    createdAt: '2025-02-18T14:00:00.000Z',
    updatedAt: '2025-02-18T14:00:00.000Z',
  },

  // 4. Policy & Grants - TANSEED
  {
    id: 'blog_tanseed_grants_04',
    slug: 'navigating-tanseed-seed-grants-for-tamil-nadu-early-stage-founders',
    title: 'The Founder’s Guide to TANSEED Seed Grants: Qualifying, Pitching, and Securing ₹10-15 Lakhs',
    subtitle: 'Everything early-stage innovators need to know about the Tamil Nadu Startup Seed Grant Fund.',
    category: 'Policy & Grants',
    coverImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80',
    tags: ['TANSEED', 'Grants', 'StartupTN', 'EarlyStage', 'Policy'],
    authorId: 'usr_adm_9x7k2p8w1m4q3v',
    authorName: 'Tamil Nadu Startup Mission',
    authorRole: 'Grants & Incubation Desk',
    authorEmail: 'admin@tnstartupmap.in',
    isFounder: false,
    status: 'PUBLISHED',
    featured: false,
    clapsCount: 168,
    readTimeMinutes: 5,
    publishedAt: '2025-02-19T09:15:00.000Z',
    isDeleted: false,
    content: `
### Fueling Grassroots Innovation Across Tamil Nadu

The **TANSEED (Tamil Nadu Startup Seed Grant Fund)** initiative by StartupTN bridges the critical capital gap between early proof-of-concept and market readiness. 

Grants of up to **₹10 Lakhs to ₹15 Lakhs** are awarded without equity dilution to promising ventures incorporated in Tamil Nadu.

---

### What Evaluators Look For:

- **Original IP & Tech Defensibility**: High marks for patentable hardware, novel algorithms, and indigenous manufacturing.
- **Regional Employment Generation**: Ventures setting up facilities in tier-2/3 district hubs like Madurai, Tirunelveli, and Trichy receive priority scoring.
- **Female & Rural Entrepreneurship**: Special quotas and support tracks for women-led ventures and rural innovators.
    `.trim(),
    createdAt: '2025-02-19T09:15:00.000Z',
    updatedAt: '2025-02-19T09:15:00.000Z',
  },

  // 5. Tech Architecture - IIT Madras DeepTech
  {
    id: 'blog_iitm_deeptech_05',
    slug: 'from-research-lab-to-orbit-how-iit-madras-became-a-deeptech-incubator-powerhouse',
    title: 'From Research Lab to Orbit: How IIT Madras Built a DeepTech Incubation Machine',
    subtitle: 'A breakdown of the institutional model that birthed AgniKul Cosmos, Detect Technologies, Ather Energy, and Mindgrove Silicon.',
    category: 'Tech Architecture',
    coverImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    tags: ['IITMadras', 'DeepTech', 'Incubation', 'Silicon', 'Patents'],
    authorId: 'usr_fnd_4h8m2n9x6y1v7k',
    authorName: 'Srinath Ravichandran',
    authorRole: 'Founder & IITM Alumnus',
    authorEmail: 'srinath@agnikul.in',
    isFounder: true,
    startupId: 'stp-agnikul',
    startupName: 'AgniKul Cosmos',
    startupSlug: 'agnikul-cosmos',
    status: 'PUBLISHED',
    featured: false,
    clapsCount: 230,
    readTimeMinutes: 7,
    publishedAt: '2025-02-19T11:45:00.000Z',
    isDeleted: false,
    content: `
### Commercializing Academic Breakthroughs

India has historically produced world-class theoretical research that struggled to cross the 'valley of death' into scalable commercial products.

At **IIT Madras Research Park**, that narrative changed decisively. By collocating faculty laboratories, venture capital partners, and corporate engineering teams under one roof, companies like AgniKul, Ather, and Detect Technologies transformed academic patents into global enterprises.

---

### Key Architectural Blueprints for University Incubators:

1. **Shared Heavy Testing Facilities**: Cryogenic test stands, semiconductor cleanrooms, and high-performance computing clusters accessible to student founders.
2. **Simplified IP Licensing**: Straightforward faculty-student equity transfer frameworks with zero bureaucratic friction.
3. **Early Venture Capital Syndicates**: Institutional angels embedded on campus providing $100k-$500k pre-seed checks within weeks of prototype demo.
    `.trim(),
    createdAt: '2025-02-19T11:45:00.000Z',
    updatedAt: '2025-02-19T11:45:00.000Z',
  },

  // 6. Soft-Deleted / Archived Test Article (To test Restore in Admin Console)
  {
    id: 'blog_archived_sample_06',
    slug: 'archived-sample-draft-for-moderation-testing',
    title: 'Archived / Soft-Deleted Article (Sample for Admin Restore Testing)',
    subtitle: 'This article was soft-deleted to demonstrate non-destructive archiving and 1-click administrative restoration.',
    category: 'Ecosystem News',
    coverImageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
    tags: ['Testing', 'Archive', 'SoftDelete'],
    authorId: 'usr_adm_9x7k2p8w1m4q3v',
    authorName: 'Tamil Nadu Admin',
    authorRole: 'System Moderator',
    authorEmail: 'admin@tnstartupmap.in',
    isFounder: false,
    status: 'ARCHIVED',
    featured: false,
    clapsCount: 12,
    readTimeMinutes: 2,
    publishedAt: '2025-02-01T00:00:00.000Z',
    isDeleted: true,
    deletedAt: '2025-02-19T12:00:00.000Z',
    deletedByUserId: 'usr_adm_9x7k2p8w1m4q3v',
    content: `
### Soft-Delete Validation Story

This record demonstrates the platform's non-destructive soft-delete architecture. In the database, the record is preserved with \`isDeleted: true\`. 

Administrators can navigate to **Admin > Stories & Blogs > Soft-Deleted / Archived** tab and click **Restore** to reactivate this article to the public directory instantly.
    `.trim(),
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2025-02-19T12:00:00.000Z',
  },
];
