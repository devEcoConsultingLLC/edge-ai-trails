import type { CityPack } from './engine';

// City packs will register themselves here as they ship.
// Each pack is a self-contained module under content/cities/<slug>/.
export const cities: ReadonlyArray<CityPack> = [];

export function findCityBySlug(slug: string): CityPack | undefined {
  return cities.find((c) => c.meta.slug === slug);
}

export function getCitySlugs(): string[] {
  return cities.map((c) => c.meta.slug);
}
