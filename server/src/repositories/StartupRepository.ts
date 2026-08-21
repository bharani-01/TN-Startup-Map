import { db, prisma } from '../database/connection.js';
import { Startup, StartupFilterQuery } from '../models/Startup.js';
import { generatePublicId } from '../utils/publicId.js';

export class StartupRepository {
  async findAll(filters: StartupFilterQuery = {}): Promise<{ startups: Startup[]; total: number; page: number; limit: number; totalPages: number }> {
    let result = Array.from(db.startups.values());

    // Soft delete filtering (default: exclude deleted records)
    if (!filters.includeDeleted) {
      result = result.filter((s) => !s.isDeleted);
    } else {
      result = result.filter((s) => s.isDeleted === true);
    }

    // Search query filter (matches name, tagline, description, city, district, sectors, founders)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.sectors.some((sec) => sec.toLowerCase().includes(q)) ||
          s.founders.some((f) => f.name.toLowerCase().includes(q))
      );
    }

    // District filter
    if (filters.district && filters.district !== 'all') {
      const d = filters.district.toLowerCase();
      result = result.filter((s) => s.districtSlug.toLowerCase() === d || s.district.toLowerCase() === d);
    }

    // Sector filter
    if (filters.sector && filters.sector !== 'all') {
      const sec = filters.sector.toLowerCase();
      result = result.filter((s) => s.sectors.some((item) => item.toLowerCase() === sec));
    }

    // Stage filter
    if (filters.stage && filters.stage !== 'all') {
      result = result.filter((s) => s.stage.toLowerCase() === filters.stage!.toLowerCase());
    }

    // Founded Year filter
    if (filters.foundedYear) {
      result = result.filter((s) => s.foundedYear === Number(filters.foundedYear));
    }

    // Funding Type filter
    if (filters.fundingType && filters.fundingType !== 'all') {
      result = result.filter((s) => s.fundingType.toLowerCase() === filters.fundingType!.toLowerCase());
    }

    // Verification status filter
    if (filters.verificationStatus && filters.verificationStatus !== 'all') {
      result = result.filter((s) => s.verificationStatus === filters.verificationStatus);
    }

    // Hiring filter
    if (filters.isHiring !== undefined) {
      result = result.filter((s) => Boolean(s.isHiring) === Boolean(filters.isHiring));
    }

    // Sorting
    const sortBy = filters.sortBy || 'trending';
    const order = filters.order || 'desc';

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'trending') {
        comparison = b.trendingScore - a.trendingScore;
      } else if (sortBy === 'recent') {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'founded') {
        comparison = b.foundedYear - a.foundedYear;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }

      return order === 'asc' ? -comparison : comparison;
    });

    const total = result.length;
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 12);
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedStartups = result.slice(offset, offset + limit);

    return {
      startups: paginatedStartups,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: string): Promise<Startup | null> {
    let s = db.startups.get(id);
    if (!s) {
      s = Array.from(db.startups.values()).find((item) => item.publicId === id || item.id === id);
    }
    if (!s || s.isDeleted) return null;
    return s;
  }

  async findBySlug(slug: string): Promise<Startup | null> {
    const s = Array.from(db.startups.values()).find(
      (item) =>
        (item.slug.toLowerCase() === slug.toLowerCase() ||
          item.id === slug ||
          item.publicId === slug) &&
        !item.isDeleted
    );
    return s || null;
  }

  async findRecentlyFunded(limit: number = 6): Promise<Array<{ startup: Startup; round: Startup['fundingRounds'][0] }>> {
    const all = Array.from(db.startups.values())
      .filter((s) => !s.isDeleted && s.fundingRounds && s.fundingRounds.length > 0)
      .map((s) => ({
        startup: s,
        round: s.fundingRounds[0],
      }))
      .sort((a, b) => new Date(b.round.date).getTime() - new Date(a.round.date).getTime())
      .slice(0, limit);

    return all;
  }

  async findRecent(limit: number = 8): Promise<Startup[]> {
    return Array.from(db.startups.values())
      .filter((s) => !s.isDeleted)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async findTrending(limit: number = 8): Promise<Startup[]> {
    return Array.from(db.startups.values())
      .filter((s) => !s.isDeleted)
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  }

  async findNearby(lat: number, lng: number, radiusKm: number = 50): Promise<Array<Startup & { distanceKm: number }>> {
    const results: Array<Startup & { distanceKm: number }> = [];

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    db.startups.forEach((s) => {
      if (!s.isDeleted) {
        const dist = getDistance(lat, lng, s.latitude, s.longitude);
        if (dist <= radiusKm) {
          results.push({
            ...s,
            distanceKm: Math.round(dist * 10) / 10,
          });
        }
      }
    });

    results.sort((a, b) => a.distanceKm - b.distanceKm);
    return results;
  }

  async getMapGeoJSON(): Promise<{ type: 'FeatureCollection'; features: any[] }> {
    const features = Array.from(db.startups.values())
      .filter((s) => !s.isDeleted)
      .map((s) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [s.longitude, s.latitude],
        },
        properties: {
          id: s.id,
          publicId: s.publicId,
          slug: s.slug,
          name: s.name,
          tagline: s.tagline,
          district: s.district,
          districtSlug: s.districtSlug,
          city: s.city,
          stage: s.stage,
          fundingType: s.fundingType,
          totalFundingInr: s.totalFundingInr,
          sectors: s.sectors,
          foundedYear: s.foundedYear,
          verificationStatus: s.verificationStatus,
          isHiring: s.isHiring,
          website: s.website,
        },
      }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  async create(data: Omit<Startup, 'id' | 'createdAt' | 'updatedAt' | 'publicId'> & { publicId?: string }): Promise<Startup> {
    const now = new Date().toISOString();
    const id = `startup-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const publicId = data.publicId || generatePublicId('stp');

    const startup: Startup = {
      ...data,
      id,
      publicId,
      isDeleted: false,
      deletedAt: null,
      deletedByUserId: null,
      createdAt: now,
      updatedAt: now,
    };

    db.startups.set(id, startup);
    db.recomputeCounts();
    return startup;
  }

  async update(id: string, data: Partial<Startup>): Promise<Startup | null> {
    let existing = db.startups.get(id);
    if (!existing) {
      existing = Array.from(db.startups.values()).find((s) => s.publicId === id || s.id === id);
    }
    if (!existing) return null;

    const updated: Startup = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    db.startups.set(existing.id, updated);
    db.recomputeCounts();
    return updated;
  }

  async delete(id: string, deletedByUserId?: string): Promise<boolean> {
    let existing = db.startups.get(id);
    if (!existing) {
      existing = Array.from(db.startups.values()).find((s) => s.publicId === id || s.id === id);
    }
    if (!existing) return false;

    existing.isDeleted = true;
    existing.deletedAt = new Date().toISOString();
    existing.deletedByUserId = deletedByUserId || 'admin';
    existing.updatedAt = new Date().toISOString();
    
    db.startups.set(existing.id, existing);
    db.recomputeCounts();
    return true;
  }

  async restore(id: string): Promise<Startup | null> {
    let existing = db.startups.get(id);
    if (!existing) {
      existing = Array.from(db.startups.values()).find((s) => s.publicId === id || s.id === id);
    }
    if (!existing) return null;

    existing.isDeleted = false;
    existing.deletedAt = null;
    existing.deletedByUserId = null;
    existing.updatedAt = new Date().toISOString();

    db.startups.set(existing.id, existing);
    db.recomputeCounts();
    return existing;
  }
}

export const startupRepository = new StartupRepository();
