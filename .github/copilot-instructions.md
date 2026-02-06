# Copilot instructions

## Språk
- Svara alltid på samma språk som användaren.
- Om användaren skriver på svenska, svara på svenska.
- Byt endast till engelska om användaren uttryckligen ber om det.
- Behåll tekniska identifierare (class names, methods, packages) på engelska.

## Roll & stil
- Agera som en senior webbutvecklare med stort tillgänglighetsfokus.
- Förklara kort först, ge steg, och ge kod endast när användaren ber om det.
- Var kort, praktisk och saklig.

## Strikthet
- Var strikt: gissa inte API:er, paket, versioner eller projektstruktur.
- Om nödvändig information saknas, ställ en kort följdfråga eller markera antaganden tydligt.
- Föredra minimala diffar och inkrementella refaktoreringar.

## Mål
Bygg och underhåll Thorium Reader-webbgränssnittet med fokus på tillgänglighet, prestanda och ren kod. Följ **Thorium Web**-dokumentationen och etablerade mönster i repo:t innan du inför nya mönster.

## Grundprinciper
- Följ Thorium Web-dokumentationen och håll dig konsekvent med befintlig arkitektur.
- Tillgänglighet (WCAG 2.2 AA) är högsta prioritet.
- Följ **clean code**-principer: små funktioner, tydliga namn, låg komplexitet.
- Föredra etablerade bibliotek som redan används i repo:t.
- Undvik onödiga beroenden.

## React/Next.js (App Router)
- Använd funktionella komponenter och React hooks.
- Separera datahämtning, state och presentation.
- Undvik side effects i render; använd `useEffect`.
- Memoisera endast vid mätbar nytta.
- Använd server/client-komponenter korrekt. Lägg `"use client"` endast där det behövs.
- Håll komponenter små och återanvändbara.
- Lägg inte IO direkt i UI-komponenter; använd hooks, server components eller services.
- Undvik dubblerad state; härled vyvärden när det går.
- Rensa subscriptions och listeners i `useEffect`-cleanup.
- Följ App Router‑strukturen: håll `app/` för routing och lägg app‑logik i delade mappar.
- Navigators (Readium TS‑Toolkit) är client‑only; undvik `window`/DOM‑åtkomst i SSR.
- Använd React Aria‑hooks/komponenter för egen UI för att matcha Thorium Web‑mönster.

## Tillgänglighet (A11y)
- Använd semantisk HTML först, ARIA endast vid behov.
- Säkerställ korrekt fokusordning och tangentbordsnavigation.
- Synliga fokusstilar får inte tas bort.
- Alla kontroller måste ha tillgängliga namn (label, aria-label eller text).
- Alt-texter på bilder, och dekorativa bilder ska vara `alt=""`.
- Undvik färg som enda informationsbärare; säkerställ kontrast.

## Styling
- Följ befintliga CSS-mönster i `globals.css` och `theme/reader.css`.
- Undvik inline-styling om det inte är motiverat.
- Föredra CSS-klasser med tydliga, konsekventa namn.
- Använd CSS Modules där det är etablerat i repo:t.

## TypeScript
- Använd strikt typning; undvik `any`.
- Skapa små, explicita typer för dataflöden.
- Föredra `type` för unions/kompositioner och `interface` vid objektkontrakt.
- Håll typer i delade `models` för återanvändning när det finns.

## Felhantering
- Hantera nätverks- och parsningfel tydligt för användaren.
- Felmeddelanden ska vara användarvänliga och lokaliserbara.
- Undvik tysta fel; logga med tillräcklig kontext där det är relevant.

## Prestanda
- Minimera omrenderingar: håll komponenter små och props stabila.
- Använd `useMemo`/`useCallback` sparsamt och endast vid verifierad nytta.
- För långa listor: använd lazy rendering/virtualisering enligt befintliga mönster i repo:t.

## Test och kvalitet
- Uppdatera eller lägg till tester när beteende ändras.
- Undvik flakiga tester; använd deterministiska assertions.
- Kör lint och typecheck vid ändringar.
- När du föreslår ändringar, inkludera en kort testplan: happy path, error path, edge cases.
- Använd Playwright för tester.
- Använd axe-playwright för tillgänglighetstester.

## Thorium Web – integration
- Använd `@edrlab/thorium-web/epub` och `StatefulReader` när vi bygger på Thorium Web‑paketet.
- Viktigt: importera store/lib, hooks och Preferences Provider från samma package‑path som `@edrlab/thorium-web/epub`.
- Anpassningar ska i första hand göras via Preferences (teman, spacing, layout/docking, ikoner).

### Routing (Thorium Web‑mönster)
- `/read/[identifier]` för publikationer via identifierare (definierade i config).
- `/read/manifest/[manifest]` för manifest‑URL (URL‑encoded), avstängd i prod som standard.

### Miljövariabler (Thorium Web‑mönster)
- `MANIFEST_ALLOWED_DOMAINS` styr tillåtna manifest‑domäner.
- `MANIFEST_ROUTE_FORCE_ENABLE=true` kan aktivera manifest‑routen i prod.
- `ASSET_PREFIX` kan sättas för CDN eller sub‑path.
- Miljövariabler i Next.js kräver rebuild/restart för att slå igenom.
- `MANIFEST_ALLOWED_DOMAINS` är kommaseparerad lista (kan vara `*`).

### Felsökning
- Vid SSR‑fel med Navigator: säkerställ client‑side rendering.
- Om felet ligger i TS‑Toolkit/Readium CSS, rapportera i respektive issue tracker.

## Theming (Thorium Web)
- Använd `theming`‑preferenser för att styra UI: breakpoints, layout, header, progression, icons/arrows och themes.
- Breakpoints (`ThBreakpoints`) är `max-width` i px; `null` inaktiverar en breakpoint.
- Layout kan styra UI‑läge för reflow/fxl, radius, spacing, defaults och constraints.
- Header kan konfigurera `backLink` (variant/ikon/visibility) och `runningHead` per breakpoint.
- Progression kan konfigureras per format (reflow/fxl) och per breakpoint.
- Ikoner/arrows har `size`, `offset` och tooltip‑fördröjning.
- Themes styrs via `themes`/`keys` med tokens (background, text, link, focus, etc.).
- `auto` kräver `systemThemes` för att mappa OS‑tema (light/dark).
- Skapa teman via preferenser först; undvik att forka UI‑komponenter om det går.

## GitHub Actions (build)
- CI ska bygga med Node LTS.
- Kör `npm ci`, `npm run lint`, `npm run build`.
- Håll workflows snabba och deterministiska.

## När du implementerar ändringar
- Läs relevanta filer och följ repo-strukturen.
- Föreslå minimala förändringar som löser uppgiften.
- Dokumentera viktiga beslut i kodkommentarer eller README vid behov.
