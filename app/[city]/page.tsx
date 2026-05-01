import Link from 'next/link';
import { GameShell } from '@/components/game/game-shell';
import { findCityBySlug, getCitySlugs } from '@/lib/city-registry';

export function generateStaticParams() {
  return getCitySlugs().map((slug) => ({ city: slug }));
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const pack = findCityBySlug(city);

  if (!pack) {
    return (
      <main className="mx-auto max-w-2xl space-y-4 p-6">
        <h1 className="text-2xl font-bold">Trail not found</h1>
        <p>No city pack registered for slug: {city}.</p>
        <Link href="/" className="underline">
          Back to the hub
        </Link>
      </main>
    );
  }

  return (
    <main>
      <GameShell pack={pack} />
    </main>
  );
}
