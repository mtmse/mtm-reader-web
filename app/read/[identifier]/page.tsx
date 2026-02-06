import { notFound } from "next/navigation";

import { PUBLICATION_MANIFESTS } from "@/src/config/publications";
import ReaderPage from "@/src/reader/ReaderPage";

type ReadPageProps = {
  params: Promise<{
    identifier: string;
  }>;
};

export default async function ReadPage({ params }: ReadPageProps) {
  const { identifier } = await params;
  const manifestUrl =
    PUBLICATION_MANIFESTS[identifier as keyof typeof PUBLICATION_MANIFESTS];

  if (!manifestUrl) {
    notFound();
  }

  return <ReaderPage manifestUrl={manifestUrl} />;
}
