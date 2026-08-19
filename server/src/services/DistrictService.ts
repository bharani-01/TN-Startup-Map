import { districtRepository } from '../repositories/DistrictRepository.js';
import { startupRepository } from '../repositories/StartupRepository.js';
import { District } from '../models/District.js';
import { ApiError } from '../utils/ApiError.js';

export class DistrictService {
  async getAllDistricts(): Promise<District[]> {
    return districtRepository.findAll();
  }

  async getDistrictBySlug(slug: string): Promise<{ district: District; startups: any[] }> {
    const district = await districtRepository.findBySlug(slug);
    if (!district) {
      throw ApiError.notFound(`District '${slug}' not found`);
    }

    const { startups } = await startupRepository.findAll({ district: district.slug, limit: 50 });

    return {
      district,
      startups,
    };
  }

  async getDistrictsGeoJSON() {
    return districtRepository.getDistrictsGeoJSON();
  }
}

export const districtService = new DistrictService();
