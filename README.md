# MTM Reader Web

Detta projekt är en Thorium Web‑baserad EPUB‑läsare byggd med Next.js (App Router).

## Projektöversikt

Målet är att tillhandahålla en webbaserad EPUB‑läsare med tillgänglighetsfokus och stöd för Thorium Webs UI‑komponenter och läsinställningar.

## Funktioner (översikt)

- Läser EPUB via Readium Web Publication Manifests.
- Stöd för reflow och fixed layout via Thorium Web.
- Tillgänglighetsstöd enligt Thorium Web (WCAG 2.2 AA).
- Teman och läsinställningar via preferences.

## Om Thorium Web

Detta projekt använder [@edrlab/thorium-web](https://www.npmjs.com/package/@edrlab/thorium-web) – ett npm-paket för att bygga tillgängliga EPUB-läsare i webbläsaren.

## Teknikval

- **Next.js 16 (App Router)** – React-framework för routing, SSR/SSG och optimerad bundling
- **React 19** – UI-komponenter med funktionella komponenter och hooks
- **TypeScript 5** – Strikt typsäkerhet (`strict: true`)
- **@edrlab/thorium-web** – Kärnan i projektet. EPUB-läsare med:
  - Inbyggt tillgänglighetsstöd (WCAG 2.2 AA)
  - Readium TS-Toolkit för EPUB-hantering
  - Readium CSS för formatering av bokinnehåll (typografi, layout, läsbarhetsinställningar)
  - `StatefulReader` och alla UI-komponenter
- **Tailwind CSS 4** – Utility-first CSS för projektspecifik styling

## Snabbstart

```bash
npm install
npm run dev
```

Öppna http://localhost:3000.

## Utveckling

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test:e2e
npm run test:e2e:ui
```

## Tester

Projektet använder Playwright för E2E‑tester och `axe-playwright` för grundläggande tillgänglihetstester.

```bash
npx playwright install
npm run test:e2e
```

## Projektstruktur

- `app/` – Next.js App Router (routing och API)
- `src/reader/` – Reader-komponenter (Reader.tsx, ReaderPage.tsx)
- `src/config/` – Publikationskatalog
- `public/locales/` – Språkfiler
- `theme/` – Reader‑tema

## Arkitektur (översikt)

- `ReaderPage` hämtar och validerar manifest via `/api/manifest`.
- `Reader` kapslar in `StatefulReader` med Thorium Web‑providers.
- Preferences definieras i `src/reader/preferences.ts`.

## Dokumentation

- [Thorium Web docs (sammanfattning)](docs/thorium-web-docs-summary.md)
- [Thorium Web docs](docs/thorium-web/)

## Miljövariabler

Miljövariabler läses in vid build‑time i Next.js. Vid ändring krävs omstart av dev‑servern.

### MANIFEST_ALLOWED_DOMAINS

Komma‑separerad lista med tillåtna domäner för manifest‑URL:er.

```bash
MANIFEST_ALLOWED_DOMAINS="publication-server.readium.org"
```

Använd `*` för att tillåta alla domäner (endast för utveckling).

### MANIFEST_ROUTE_FORCE_ENABLE

Aktiverar `/read/manifest/[manifest]` i produktion.

```bash
MANIFEST_ROUTE_FORCE_ENABLE=true
```

### NEXT_PUBLIC_DEFAULT_LANGUAGE

Primärt språk för UI (t.ex. `sv` eller `en`).

```bash
NEXT_PUBLIC_DEFAULT_LANGUAGE=sv
```

## URL-struktur (följer Thoriums rekommendation)

- `/read/[identifier]` används för publikationer som finns i [src/config/publications.ts](src/config/publications.ts).
- `/read/manifest/[manifest]` är avstängd i produktion om `MANIFEST_ROUTE_FORCE_ENABLE` inte är satt.

## Språkhantering

Använder `ThI18nProvider` från Thorium Web för översättningar.

- **Primärt språk**: `NEXT_PUBLIC_DEFAULT_LANGUAGE` (default `sv`)
- **Fallback**: Engelska (`en`)
- **Översättningsfiler**: `/public/locales/{språk}/{namespace}.json`
  - `thorium-web.json` – UI-texter för läsaren
  - `thorium-shared.json` – Delade översättningar

För dynamiskt språkval baserat på webbläsarinställningar krävs logik för att sätta `lng`-prop i `ThI18nProvider`.
