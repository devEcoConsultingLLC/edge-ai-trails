import Link from 'next/link';
import { TopBanner } from '@/components/top-banner';
import { generateStaticParams as cityParams } from './generateStaticParams';

// Next.js 16 with `output: 'export'` requires every reachable slug to appear
// in generateStaticParams. Until phase 2 populates the registry, fall back to
// a small set of placeholder slugs (including the soon-to-be-ported sandiego)
// so dev and build both succeed against the documented verification URLs.
const PLACEHOLDER_CITIES: Array<{ city: string }> = [
  { city: '_placeholder' },
  { city: 'sandiego' },
];

export async function generateStaticParams() {
  const params = cityParams();
  return params.length > 0 ? params : PLACEHOLDER_CITIES;
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
