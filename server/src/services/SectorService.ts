import { sectorRepository } from '../repositories/SectorRepository.js';
import { Sector } from '../models/Sector.js';

export class SectorService {
  async getAllSectors(): Promise<Sector[]> {
    return sectorRepository.findAll();
  }

  async getSectorBySlug(slug: string): Promise<Sector | null> {
    return sectorRepository.findBySlug(slug);
  }
}

export const sectorService = new SectorService();
