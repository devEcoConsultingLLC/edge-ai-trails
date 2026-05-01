// City packs will populate this list in phase 2 by reading from `lib/city-registry.ts`.
// For now an empty array means no real cities are prerendered.
export function generateStaticParams(): Array<{ city: string }> {
  return [];
}
