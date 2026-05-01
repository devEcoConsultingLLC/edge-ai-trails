import { TopBanner } from '@/components/top-banner';

export default function HubPage() {
  return (
    <>
      <TopBanner />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">EDGE AI Trails</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Suite scaffold ready. City packs coming online soon.
        </p>
      </main>
    </>
  );
}
