import Link from 'next/link';
import { TopBanner } from '@/components/top-banner';

// Phase 1 placeholder: hardcoded slugs so dev and build succeed before
// any city packs exist. Phase 2 replaces this with values read from
// lib/city-registry.ts.
const PLACEHOLDER_CITIES: Array<{ city: string }> = [
  { city: '_placeholder' },
  { city: 'sandiego' },
];

export async function generateStaticParams() {
  return PLACEHOLDER_CITIES;
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;

  return (
    <>
      <TopBanner />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">
          Trail not yet ported
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Requested city: <code className="font-mono">{city}</code>
        </p>
        <p className="mt-8">
          <Link href="/edge-ai-trails" className="text-primary underline">
            Back to the hub
          </Link>
        </p>
      </main>
    </>
  );
}
