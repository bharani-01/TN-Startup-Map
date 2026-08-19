import { db } from '../database/connection.js';
import { Sector } from '../models/Sector.js';

export class SectorRepository {
  async findAll(): Promise<Sector[]> {
    db.recomputeCounts();
    return Array.from(db.sectors.values()).sort((a, b) => (b.startupsCount || 0) - (a.startupsCount || 0));
  }

  async findBySlug(slug: string): Promise<Sector | null> {
    db.recomputeCounts();
    const s = Array.from(db.sectors.values()).find((item) => item.slug.toLowerCase() === slug.toLowerCase());
    return s || null;
  }
}

export const sectorRepository = new SectorRepository();
