Detta är en enkel Thorium Web‑baserad läsare byggd med Next.js (App Router).

## Om Thorium Web

Detta projekt använder [@edrlab/thorium-web](https://www.npmjs.com/package/@edrlab/thorium-web) – ett npm-paket för att bygga tillgängliga EPUB-läsare i webbläsaren.

## Tech stack

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

## URL-struktur (följer Thoriums rekommendation)

- `/read/[identifier]` används för publikationer som finns i [src/config/publications.ts](src/config/publications.ts).
- `/read/manifest/[manifest]` är avstängd i produktion om `MANIFEST_ROUTE_FORCE_ENABLE` inte är satt.

## Språkhantering

Använder `ThI18nProvider` från Thorium Web för översättningar.

- **Primärt språk**: Svenska (`sv`), satt i [src/reader/Reader.tsx](src/reader/Reader.tsx)
- **Fallback**: Engelska (`en`)
- **Översättningsfiler**: `/public/locales/{språk}/{namespace}.json`
  - `thorium-web.json` – UI-texter för läsaren
  - `thorium-shared.json` – Delade översättningar

För dynamiskt språkval baserat på webbläsarinställningar krävs logik för att sätta `lng`-prop i `ThI18nProvider`.
