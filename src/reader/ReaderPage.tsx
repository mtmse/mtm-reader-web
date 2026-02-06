"use client";

import { useEffect, useState } from "react";

import Reader from "./Reader";

type ManifestLink = {
  href?: string;
  rel?: string | string[];
  type?: string;
};

type EpubManifest = {
  "@context"?: string | string[];
  readingOrder?: Array<{ href: string; type?: string }>;
  resources?: Array<{ href: string; type?: string }>;
  metadata?: { title?: string; [key: string]: unknown };
  links?: ManifestLink[];
};

const isValidManifest = (data: unknown): data is EpubManifest => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const manifest = data as Record<string, unknown>;
  const hasContext = "@context" in manifest;
  const hasReadingOrder = "readingOrder" in manifest && Array.isArray(manifest.readingOrder);
  const hasLinks = "links" in manifest && Array.isArray(manifest.links);

  return hasContext || hasReadingOrder || hasLinks;
};

type ReaderPageProps = {
  manifestUrl: string;
};

const getSelfHref = (manifest: EpubManifest, fallback?: string) => {
  const selfLink = manifest.links?.find((link) => {
    if (!link.rel) {
      return false;
    }

    return Array.isArray(link.rel) ? link.rel.includes("self") : link.rel === "self";
  });

  return selfLink?.href ?? fallback ?? "";
};

export default function ReaderPage({ manifestUrl }: ReaderPageProps) {
  const [manifest, setManifest] = useState<EpubManifest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const requestUrl = `/api/manifest?url=${encodeURIComponent(manifestUrl)}`;

    fetch(requestUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json().catch(() => {
          throw new Error("Invalid JSON response from manifest API");
        });
      })
      .then((data) => {
        if (!isValidManifest(data)) {
          throw new Error("Invalid Readium Web Publication Manifest structure");
        }
        if (active) {
          setManifest(data);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (active) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [manifestUrl]);

  const selfHref = manifest ? getSelfHref(manifest, manifestUrl) : "";

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div
          role="status"
          aria-live="polite"
          aria-label="Läsare laddar"
          className="text-sm text-gray-700"
        >
          Laddar läsare...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md">
          <h1 className="mb-2 text-lg font-bold text-red-600">Ett fel uppstod</h1>
          <p className="mb-4 text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Försök igen
          </button>
        </div>
      </main>
    );
  }

  if (!manifest || !selfHref) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-sm text-red-600">Manifest kunde inte laddas</div>
      </main>
    );
  }

  return <Reader manifest={manifest} selfHref={selfHref} />;
}
