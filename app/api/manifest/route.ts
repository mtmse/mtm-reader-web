import { NextResponse } from "next/server";

const getAllowedDomains = () => {
  const raw = process.env.MANIFEST_ALLOWED_DOMAINS;
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const isAllowedHost = (host: string, allowedDomains: string[]) => {
  if (allowedDomains.length === 0) {
    return false;
  }

  if (allowedDomains.includes("*")) {
    return true;
  }

  return allowedDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid url parameter." }, { status: 400 });
  }

  const allowedDomains = getAllowedDomains();
  if (!isAllowedHost(targetUrl.hostname, allowedDomains)) {
    return NextResponse.json(
      { error: "Domain not allowed. Configure MANIFEST_ALLOWED_DOMAINS." },
      { status: 403 }
    );
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Manifest request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const manifest = await response.json();
    return NextResponse.json(manifest, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
