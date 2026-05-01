import type { CityPack } from './engine';
import { sandiego } from '@/content/cities/sandiego';

export const cities: ReadonlyArray<CityPack> = [sandiego];

export function findCityBySlug(slug: string): CityPack | undefined {
  return cities.find((c) => c.meta.slug === slug);
}

export function getCitySlugs(): string[] {
  return cities.map((c) => c.meta.slug);
}
