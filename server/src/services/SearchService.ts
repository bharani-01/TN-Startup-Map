import { startupRepository } from '../repositories/StartupRepository.js';
import { districtRepository } from '../repositories/DistrictRepository.js';
import { sectorRepository } from '../repositories/SectorRepository.js';

export interface SearchResultItem {
  id: string;
  type: 'STARTUP' | 'DISTRICT' | 'SECTOR' | 'FOUNDER';
  title: string;
  subtitle: string;
  slug: string;
  url: string;
  badge?: string;
  icon?: string;
}

export class SearchService {
  async search(query: string): Promise<{
    query: string;
    total: number;
    results: {
      startups: SearchResultItem[];
      districts: SearchResultItem[];
      sectors: SearchResultItem[];
      founders: SearchResultItem[];
    };
  }> {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      return {
        query: '',
        total: 0,
        results: { startups: [], districts: [], sectors: [], founders: [] },
      };
    }

    // 1. Startups search
    const { startups } = await startupRepository.findAll({ search: q, limit: 10 });
    const startupResults: SearchResultItem[] = startups.map((s) => ({
      id: s.id,
      type: 'STARTUP',
      title: s.name,
      subtitle: `${s.sectors.join(', ')} • ${s.district}`,
      slug: s.slug,
      url: `/startups/${s.slug}`,
      badge: s.stage,
    }));

    // 2. Districts search
    const allDistricts = await districtRepository.findAll();
    const districtResults: SearchResultItem[] = allDistricts
      .filter((d) => d.name.toLowerCase().includes(q) || d.headquarters.toLowerCase().includes(q) || d.description.toLowerCase().includes(q))
      .slice(0, 5)
      .map((d) => ({
        id: d.id,
        type: 'DISTRICT',
        title: d.name,
        subtitle: `${d.startupsCount || 0} Startups • ${d.headquarters}`,
        slug: d.slug,
        url: `/districts/${d.slug}`,
        badge: `${d.startupsCount} startups`,
      }));

    // 3. Sectors search
    const allSectors = await sectorRepository.findAll();
    const sectorResults: SearchResultItem[] = allSectors
      .filter((sec) => sec.name.toLowerCase().includes(q) || sec.description.toLowerCase().includes(q))
      .slice(0, 5)
      .map((sec) => ({
        id: sec.id,
        type: 'SECTOR',
        title: sec.name,
        subtitle: `${sec.startupsCount || 0} Startups • ${sec.description.slice(0, 60)}...`,
        slug: sec.slug,
        url: `/startups?sector=${sec.slug}`,
        badge: `${sec.startupsCount} startups`,
      }));

    // 4. Founders search
    const founderResults: SearchResultItem[] = [];
    const allStartupsList = (await startupRepository.findAll({ limit: 200 })).startups;
    allStartupsList.forEach((s) => {
      s.founders.forEach((f) => {
        if (f.name.toLowerCase().includes(q)) {
          founderResults.push({
            id: `${s.id}-${f.name}`,
            type: 'FOUNDER',
            title: f.name,
            subtitle: `${f.role} at ${s.name} (${s.district})`,
            slug: s.slug,
            url: `/startups/${s.slug}`,
            badge: s.name,
          });
        }
      });
    });

    const total =
      startupResults.length +
      districtResults.length +
      sectorResults.length +
      founderResults.length;

    return {
      query: q,
      total,
      results: {
        startups: startupResults,
        districts: districtResults,
        sectors: sectorResults,
        founders: founderResults.slice(0, 6),
      },
    };
  }
}

export const searchService = new SearchService();
