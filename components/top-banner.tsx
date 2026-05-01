'use client';

export function TopBanner() {
  return (
    <div className="w-full bg-secondary text-secondary-foreground text-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center">
        <span>Experience by</span>
        <a
          href="https://thedeveco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:text-primary"
        >
          devEco Consulting LLC
        </a>
        <span aria-hidden="true">|</span>
        <a
          href="https://www.edgeaifoundation.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2 hover:text-primary"
        >
          Register for the next EDGE AI event
        </a>
      </div>
    </div>
  );
}
