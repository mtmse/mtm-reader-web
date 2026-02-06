import { notFound } from "next/navigation";

import ReaderPage from "@/src/reader/ReaderPage";

type ManifestPageProps = {
  params: Promise<{
    manifest: string;
  }>;
};

const isManifestRouteEnabled = () => {
  if (process.env.MANIFEST_ROUTE_FORCE_ENABLE === "true") {
    return true;
  }

  return process.env.NODE_ENV !== "production";
};

export default async function ManifestPage({ params }: ManifestPageProps) {
  if (!isManifestRouteEnabled()) {
    notFound();
  }

  const { manifest } = await params;
  const manifestUrl = decodeURIComponent(manifest ?? "");
  if (!manifestUrl) {
    notFound();
  }

  return <ReaderPage manifestUrl={manifestUrl} />;
}
