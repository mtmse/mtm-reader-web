# Thorium Web (readonly) – sammanfattning

> Innehållet i thorium-web-readonly är endast referens och ska inte modifieras.

## Översikt

Thorium Web är en Next.js-baserad, tillgänglig EPUB-läsare byggd med React Aria, Readium TS-Toolkit (navigator), Readium CSS och Redux. Publikationer levereras via Readium Web Publication Manifest och Positions List (vanligtvis genererat av Readium Go-Toolkit). Projektet kan användas både som Next.js-app och som npm-paket (`@edrlab/thorium-web`).

## Arkitektur

### Systemdiagram
```
Cloudflare Pages (CDN)
       ↓
   Next.js
       ↓
   Reader
   ├── App UI (React Aria)
   └── Navigators (Readium TS-Toolkit, Readium CSS)
       ↓
   Readium Positions List
       ↓
   Readium Web Publication Manifest
       ↓
  Readium Go-Toolkit (Parsing)
       ↓
   Google Cloud (Publication Storage)
```

### Komponenter
- **Frontend:** Next.js + TypeScript
- **UI:** React Aria Components för tillgänglighet
- **Navigator:** Readium TS-Toolkit (client-only, kräver DOM)
- **Styling av EPUB:** Readium CSS
- **State:** Redux (global state management)
- **i18n:** react-i18next
- **Deployment:** Cloudflare Pages (referens), Vercel eller annan Next.js-kompatibel plattform

### Prerequisites för implementation
> **VIKTIGT:** Följande måste implementeras av deployer utanför Thorium Web

1. **Server med publikationer:** Server som kan lagra och servera publikationer med Readium Web Publication Manifest och Positions List. Publikationens resurser måste vara individuellt hämtbara.
2. **Deployment-plattform:** Plattform för Next.js deployment (Cloudflare Pages, Vercel etc.).
3. **Publication Parsing:** Readium Go-Toolkit för att generera manifest och positions list från EPUB-filer.

## Routing & säkerhet

- `/read/[identifier]` – För publikationer definierade i `src/config/publications.ts`
- `/read/manifest/[manifest]` – För publikationer via manifest-URL (URL-encoded). 
  - **Avstängd i produktion som standard** av säkerhetsskäl
  - Aktiveras med `MANIFEST_ROUTE_FORCE_ENABLE=true`
  - Manifest-URL:er valideras mot `MANIFEST_ALLOWED_DOMAINS`

## Miljövariabler

> **OBS:** Miljövariabler i Next.js är embedded vid build-time. Rebuild och restart krävs för ändringar.

### MANIFEST_ROUTE_FORCE_ENABLE
Aktiverar `/read/manifest/[manifest]`-routen i produktion.
```bash
MANIFEST_ROUTE_FORCE_ENABLE=true
```

### MANIFEST_ALLOWED_DOMAINS
Kommaseparerad lista med tillåtna domäner för manifest-URL:er. Använd `*` för alla domäner (endast utveckling).
```bash
MANIFEST_ALLOWED_DOMAINS="publication-server.readium.org,other-domain.com"
```

### ASSET_PREFIX
Bas-path för assets (CDN-URL eller subdirectory).
```bash
ASSET_PREFIX="https://cdn.example.com"
# eller
ASSET_PREFIX="/subdirectory"
```

## Paket & peer dependencies

### @edrlab/thorium-web Package
- Kan användas i valfri React-app (inte bara Next.js)
- Exponerar `StatefulReader` och andra komponenter
- **Peer dependencies måste installeras manuellt:**
  ```bash
  npm install @edrlab/thorium-web @readium/css @readium/navigator \
    @readium/navigator-html-injectables @readium/shared react-redux \
    @reduxjs/toolkit i18next i18next-browser-languagedetector \
    i18next-http-backend motion react-aria react-aria-components \
    react-stately react-modal-sheet react-resizable-panels
  ```

### Package Structure
- `@edrlab/thorium-web/core` – Core components, hooks, helpers
- `@edrlab/thorium-web/epub` – EPUB reader med StatefulReader
- `@edrlab/thorium-web/webpub` – WebPub reader
- `@edrlab/thorium-web/misc` – Utility components (PublicationGrid, StatefulLoader)
- `@edrlab/thorium-web/preferences` – Preferences management system

### Viktiga begränsningar
- Packaged components har dependencies och restrictions (kommer förbättras)
- `StatefulReader` accepterar inte `children` i nuvarande version
- Nya beroenden måste läggas i både `dependencies` och `peerDependencies`
- Externa bibliotek måste markeras `external` i `tsup.config.ts`

## Preferenser & anpassning

### Grundprincip
Projektet är designat för **customization via Preferences** istället för fork. Stor del av funktionalitet kan konfigureras genom preferenser utan att modifiera komponenter.

### Skapa och hantera preferenser
- `createPreferences<CustomKeys>()` – Skapar preferences-objekt med custom typer
- `ThPreferencesProvider` – Context provider för preferences
  - Prop: `adapter` (optional) – Custom adapter för persistence
  - Prop: `initialPreferences` (optional) – Initial preferences
- `StatefulPreferencesProvider` – Preferences Provider med Redux Adapter inbyggd (använder PreferencesSlice för persistence)
- `usePreferences<CustomKeys>()` – Hook för att läsa preferences (read-only)
- `updatePreferences()` – Funktion för att uppdatera preferences (kräver komplett objekt)

### Direction & Locale
- **Direction:** `ltr` | `rtl` (enum `ThLayoutDirection`) – Styr entire layout inklusive docking panels
- **Locale:** Måste sättas korrekt för React Aria components (t.ex. `"sv-SE"`, `"en-US"`)
  - Om inte satt används system/browser locale
  - Konflikt mellan `direction` och browser locale kan uppstå

### Metadata
#### Document Title
Konfigureras via `documentTitle`:
- `format`: Enum `ThDocumentTitleFormat`:
  - `title` – Publikationens titel
  - `chapter` – Nuvarande kapitel/sektion
  - `titleAndChapter` – Båda
  - `none` – Använd default från markup
- Alternativt: Objekt med `key` (translation key) och `fallback`

### Typography
Konfigureras via `typography`-objektet:
- `pageGutter` (px) – Padding för `body` i publikationer
- `optimalLineLength` (ch) – Optimal radlängd för auto-värde vid paginering
- `minimalLineLength` (ch) – Min radlängd för kolumner när `n >= 2`
  - `undefined`: använd optimalLineLength
  - `null`: inaktiverad, ingen undre gräns
- `maximalLineLength` (ch) – Max radlängd
  - `undefined`: använd optimalLineLength
  - `null`: inaktiverad, ingen övre gräns

### Affordances
Konfigureras via `affordances`-objektet:

#### Scroll Affordances
```typescript
affordances: {
  scroll: {
    hintInImmersive: false,  // Visa i immersive mode
    toggleOnMiddlePointer: ["tap", "click"],  // Middle tap/click toggle
    hideOnForwardScroll: true,  // Dölj vid scroll framåt
    showOnBackwardScroll: false  // Visa vid scroll bakåt
  }
}
```

#### Pagination Affordances
Konfiguration för `reflow` och `fxl` med `default` och `breakpoints`:
- `variant`: `"none"` | `"stacked"` | `"layered"` (default)
  - **OBS:** FXL är alltid `layered` oavsett config
- `discard`: Array av conditions för att dölja arrows:
  - `"navigation"`, `"immersive"`, `"fullscreen"`
- `hint`: Array av conditions för att visa arrows:
  - `"immersiveChange"`, `"fullscreenChange"`, `"layoutChange"`

### Shortcuts (WIP)
> **OBS:** Support är mycket basic för närvarande

- `representation`: Enum `ThShortcutRepresentation` (`symbol`, `short`, `long`)
  - Exempel: `Option` blir `⌥` (symbol), `alt` (short), `Option` (long)
- `joiner`: String mellan keys (t.ex. `"+"`)

### Theming Hook
- `useTheming()` – Hook som kopplar ihop breakpoints och a11y-hooks:
  - Reduced motion
  - Contrast preferences
  - Color scheme (light/dark)
  - Genererar themes dynamiskt från preferences

## Theming

Theming-systemet styr UI-utseende och beteende genom konfigurerbara komponenter. Preferences-baserat design gör att varje app kan anpassa sin reader helt utan att forka komponenter.

### Breakpoints (ThBreakpoints)
Definierar brytpunkter för responsive design (Material Design-inspirerat):
- `compact`: `600` (px, max-width)
- `medium`: `840` (px, max-width)
- `expanded`: `1240` (px, max-width) – kan sättas till `null` för att inaktivera
- `large`: `1600` (px, max-width)
- `xLarge`: `null` (rekommenderat)

```typescript
const breakpoints: ThBreakpoints = {
  compact: 600,
  medium: 840,
  expanded: 1240,
  large: 1600,
  xLarge: null,  // Inaktiverad
}
```

### Layout UI
Styr UI-läge per format och breakpoint:
- **Mode:** `stacked` | `layered`
  - `stacked`: UI i dokumentflöde
  - `layered`: UI över innehåll med scrim
- **Radius:** Border radius för sheets
- **Spacing:** Gap mellan UI-element
- **Defaults:** Default-läge för `reflow` och `fxl`
- **Constraints:** Per-breakpoint overrides

```typescript
layout: {
  mode: {
    reflow: { default: "stacked", breakpoints: { compact: "layered" } },
    fxl: { default: "layered" }
  },
  radius: 16,
  spacing: 8,
  defaults: { reflow: "stacked", fxl: "layered" }
}
```

### Header
Konfigurera top header med `backLink` och `runningHead`.

#### BackLink
```typescript
backLink: {
  variant: "button",  // "button" | "iconButton"
  icon: CustomIconComponent,  // Optional custom icon
  visibility: {
    default: "always",  // "always" | "collapsible" | "overflow"
    breakpoints: { compact: "overflow" }
  }
}
```

#### Running Head
```typescript
runningHead: {
  default: true,  // boolean: visa eller dölj
  breakpoints: { compact: false }  // Dölj på compact
}
```

### Progression
Konfigurera läsprogression (progress bar) per format och breakpoint:
```typescript
progression: {
  reflow: {
    default: { variant: "bar", collapsible: false },
    breakpoints: {
      compact: { variant: "dot", collapsible: true }
    }
  },
  fxl: { default: { variant: "fraction" } }
}
```

### Icons & Arrows
Konfigurera navigation arrows (för paginerad vy):
- `size` (px): Icon size
- `offset` (px): Avstånd från sidkant (horizontal) och centrum (vertical)
- `tooltipDelay` (ms): Fördröjning innan tooltip visas

```typescript
icons: {
  size: 32,
  offset: { horizontal: 16, vertical: 8 },
  tooltipDelay: 500
}
```

### Themes
Definiera färgteman för reader.

#### Theme Tokens
- `background`: Bakgrund
- `text`: Primär text
- `textSecondary`: Sekundär text
- `link`: Länkfärg
- `linkHover`: Länk hover
- `linkActive`: Länk active
- `focus`: Focus outline
- `shade`: Skuggad yta
- `shadeSecondary`: Sekundär skuggad yta
- `border`: Kantlinje
- `scrim`: Overlay för modals/sheets

#### Exempel
```typescript
themes: {
  keys: ["light", "dark", "sepia"],
  colors: {
    light: {
      background: "#ffffff",
      text: "#1a1a1a",
      textSecondary: "#666666",
      link: "#0066cc",
      linkHover: "#0052a3",
      linkActive: "#003d7a",
      focus: "#0066cc",
      shade: "#f5f5f5",
      shadeSecondary: "#e0e0e0",
      border: "#cccccc",
      scrim: "rgba(0, 0, 0, 0.5)"
    },
    dark: { /* ... */ },
    sepia: { /* ... */ }
  }
}
```

#### Auto Theme
För att använda OS-tema (light/dark):
- Lägg till `"auto"` i `keys`
- Definiera `systemThemes`:
  ```typescript
  themes: {
    keys: ["auto", "light", "dark"],
    systemThemes: { light: "light", dark: "dark" },
    colors: { /* ... */ }
  }
  ```

## Docking

Docking-systemet låter UI-komponenter docka i sidopaneler istället för att visa som sheets.

### Dock Configuration
Konfiguration per breakpoint:
```typescript
dock: {
  default: false,  // Inaktiverad som default
  breakpoints: {
    medium: "start",  // Docka i vänsterkant
    large: true       // Docka i båda sidor (start + end)
  }
}
```

**Värden:**
- `false`: Inaktiverad
- `true`: Docka i både start och end
- `"start"`: Endast vänster/start panel
- `"end"`: Endast höger/end panel

### Display Order
Konfigurera ordning för actions i docked panels:
```typescript
dockedStart: ["settings", "navigation"],
dockedEnd: ["annotations", "search"]
```

### Docking Preferences (Per Action)
```typescript
actions: {
  settings: {
    dockable: {
      dragIndicator: true,  // Visa drag handle
      width: 320,           // Default width
      minWidth: 260,
      maxWidth: 480
    }
  }
}
```

### Docked Sheets
Sheets konfigurerade som `dockedStart` eller `dockedEnd`:
```typescript
sheet: {
  type: "dockedStart",
  // Ingen popover/bottomSheet config behövs
}
```

## Settings

Settings styr konfigurationspanelen för läsaren.

### Display Order
Konfigurera ordning för settings per format:
```typescript
reflowOrder: ["text", "spacing", "theme", "layout"],
fxlOrder: ["theme", "layout"]
```

### Standalone vs Advanced
Settings grupperas i `textGroup` och `spacingGroup`:
- **Standalone:** Enskilda inställningar (fontSize, fontFamily)
- **Advanced:** Avancerade komponenter som visar flera settings (TextSettings, SpacingSettings)

```typescript
textGroup: {
  standalone: ["fontSize"],
  advanced: <CustomTextSettings />
}
```

### Range Settings Configuration
Konfigurera range inputs (slider/stepper):
```typescript
fontSize: {
  variant: "stepper",  // "slider" | "stepper"
  placeholder: "--",   // Placeholder när inget värde satt
  range: { min: 12, max: 32 },
  step: 1
}
```

### Line Height Configuration
Line height har specialhantering:
- Default: `1.5em`
- Stepper: 5 steg mellan `1.2em` och `2.0em`
- Slider: Kontinuerligt

## Actions & Sheets

Actions är UI-komponenter (knappar) som öppnar sheets (modals/panels). Thorium Web använder detta för navigation, settings, annotations etc.

### Actions Configuration
```typescript
actions: {
  navigation: {
    trigger: <CustomTriggerButton />,  // Custom trigger component
    target: <CustomNavigationPanel />, // Custom target content
    visibility: {
      default: "always",  // "always" | "collapsible" | "overflow"
      breakpoints: { compact: "collapsible" }
    },
    shortcut: { key: "n", modifiers: ["ctrl"] },
    sheet: { /* sheet config */ },
    docked: { /* docked config */ },
    snapped: { /* snappoints config */ }
  }
}
```

#### Trigger & Target
- **Trigger:** Knapp eller UI-element som öppnar sheetet
- **Target:** Innehåll som visas i sheetet

#### Visibility
- `always`: Alltid synlig
- `collapsible`: Kollapsbar (ikon endast)
- `overflow`: Flyttas till overflow-menu

### Sheet Types
- `popover`: Popover med pointer
- `bottomSheet`: Bottom sheet (mobil)
- `fullscreen`: Fullscreen modal
- `dockedStart`: Dockad i vänsterkant
- `dockedEnd`: Dockad i högerkant

### Sheet Configuration
```typescript
sheet: {
  type: "bottomSheet",
  bottomSheet: { snapped: true },  // Använd snappoints
  fullscreen: { hasScrim: true }
}
```

### StatefulSheetWrapper
Wrapper för custom sheets som behöver Redux state:
```typescript
import { StatefulSheetWrapper } from "@edrlab/thorium-web/epub"

<StatefulSheetWrapper>
  {(props) => <YourCustomSheet {...props} />}
</StatefulSheetWrapper>
```

## Collapsibility & Visibility

System för att dölja/visa UI-element baserat på tillgängligt utrymme.

### Global Collapse
Konfigurera global collapsibility per breakpoint:
```typescript
collapsible: {
  default: false,  // Ingen collapse
  breakpoints: {
    compact: true,  // Collapse allt till ikoner
    compact: { iconCountBeforeOverflow: 3 }  // Behåll 3 ikoner, resten i overflow
  }
}
```

### Per-Action Visibility
Konfigurera visibility per action:
```typescript
actions: {
  navigation: {
    visibility: {
      default: "always",
      breakpoints: {
        compact: "collapsible",  // Visa endast ikon
        medium: "overflow"       // Flytta till overflow-menu
      }
    }
  }
}
```

**Värden:**
- `always`: Alltid synlig med text + ikon
- `collapsible`: Kollapsbar (ikon endast när collapsed)
- `overflow`: Flyttas till overflow-menu

### Priority
Actions med `collapsible` kollapsar först, sedan `overflow`, sist `always`.

## Snappoints

Snappoints styr bottom sheet-beteende (mobile). Sheets kan "snappa" till definierade höjder.

### Scrim Configuration
```typescript
scrim: {
  default: true,  // Visa scrim (overlay)
  snapPoints: { atMinHeight: false }  // Dölj scrim vid minHeight
}
```

### Max Width Override
Override maxWidth för snapped sheets:
```typescript
maxWidth: {
  default: null,  // Ingen override
  snapPoints: 768  // Max 768px när snapped
}
```

### Snap Points Properties
```typescript
snapPoints: {
  minHeight: 200,           // Absolut min höjd (px)
  peekHeight: "content-height",  // "content-height" | number
  maxHeight: "full-height"  // "full-height" | "content-height" | number
}
```

**Värden:**
- `"full-height"`: 100vh minus safe areas
- `"content-height"`: Innehållets faktiska höjd
- `number`: Absolut höjd i px

### Logic
- Användaren kan dra sheet mellan snappoints
- Om `peekHeight` = `"content-height"` och innehållet < minHeight, använd minHeight
- Om innehållet > maxHeight, blir sheetet scrollbart

**Exempel:**
```typescript
// 3 snappoints: 200px (min), content height (peek), full height (max)
snapPoints: {
  minHeight: 200,
  peekHeight: "content-height",
  maxHeight: "full-height"
}
```

## Plugins & Extensibility

Thorium Web har ett plugin-system för att utöka funktionalitet utan att forka projektet.

### ThPlugin Interface
```typescript
interface ThPlugin {
  name: string;
  components?: {
    [key: string]: React.ComponentType<any>;
  };
  actions?: {
    [key: string]: ThAction;
  };
  preferences?: {
    [key: string]: any;
  };
}
```

### createDefaultPlugin
Helper för att skapa plugins:
```typescript
import { createDefaultPlugin } from "@edrlab/thorium-web/core"

const myPlugin = createDefaultPlugin({
  name: "my-plugin",
  components: {
    customSettings: MyCustomSettingsComponent
  }
})
```

### Registering Plugins
Registrera plugins via preferences:
```typescript
const preferences = createPreferences({
  plugins: [myPlugin, anotherPlugin]
})
```

### Building Custom Components
Använd core hooks och components för att bygga custom components:
```typescript
import { useReader, Button } from "@edrlab/thorium-web/core"

function MyCustomComponent() {
  const reader = useReader()
  return <Button onPress={() => reader.navigate("next")}>Next</Button>
}
```

## Core Package

Core package (`@edrlab/thorium-web/core`) innehåller grundläggande komponenter, hooks och helpers delade mellan epub, webpub och misc packages.

### Components
React Aria-wrappers för tillgängliga UI-komponenter:
- `Button`, `Toggle`, `Slider`, `Menu`, `Popover`, `Dialog`, `Tooltip` etc.

### Hooks

#### useEpubNavigator
Ger tillgång till EPUB-navigator:
```typescript
const navigator = useEpubNavigator()
navigator.navigate("next")
```

#### useBreakpoints
Ger current breakpoint:
```typescript
const breakpoint = useBreakpoints()  // "compact" | "medium" | "expanded" | "large" | "xLarge"
```

#### useMediaQuery
Hook för media queries:
```typescript
const isCompact = useMediaQuery("(max-width: 600px)")
```

#### A11y Hooks
- `useReducedMotion()`: Detektera reduced motion preference
- `useColorScheme()`: Detektera ljust/mörkt läge
- `useContrastPreference()`: Detektera contrast preference

### Helpers

#### breakpointsToMediaQueries
Konverterar breakpoints till media queries:
```typescript
const mediaQueries = breakpointsToMediaQueries(breakpoints)
```

#### formatProgression
Formaterar läsprogression:
```typescript
const formatted = formatProgression(0.42)  // "42%"
```

#### propsToCSSVars
Konverterar props till CSS custom properties:
```typescript
const cssVars = propsToCSSVars({ spacing: 16, radius: 8 })
// { "--spacing": "16px", "--radius": "8px" }
```

### Lib

#### ThStoreProvider
Redux store provider:
```typescript
<ThStoreProvider store={store}>
  {children}
</ThStoreProvider>
```

#### useAppDispatch & useAppSelector
Redux hooks:
```typescript
const dispatch = useAppDispatch()
const value = useAppSelector((state) => state.preferences.theme)
```

### Preferences
- `createPreferences<CustomKeys>()`: Skapa preferences
- `ThPreferencesProvider`: Context provider
- `usePreferences()`: Läsa preferences
- `updatePreferences()`: Uppdatera preferences (kräver komplett objekt)

## Epub Package

Epub package (`@edrlab/thorium-web/epub`) innehåller EPUB-specifika komponenter och hooks.

### StatefulReader
Main reader component:
```typescript
<StatefulReader
  rawManifest={manifest}  // Readium Web Publication Manifest
  selfHref={selfHref}     // Base URL för resurser
/>
```

**Props:**
- `rawManifest`: Readium Web Publication Manifest (JSON)
- `selfHref`: Base URL för publikationens resurser

**Viktiga begränsningar:**
- Accepterar inte `children` i nuvarande version
- Kräver client-side rendering (använder DOM/window)

### Required Providers
För att använda `StatefulReader` krävs följande providers (i ordning):
```typescript
<ThStoreProvider store={store}>
  <ThPreferencesProvider>
    <ThI18nProvider lng="sv" fallbackLng="en">
      <StatefulReader />
    </ThI18nProvider>
  </ThPreferencesProvider>
</ThStoreProvider>
```

### Stateful Components
Färdiga komponenter för EPUB reader:
- `StatefulReaderHeader`: Top header
- `StatefulReaderFooter`: Bottom footer
- `StatefulReaderProgression`: Progress bar
- `StatefulReaderPagination`: Page navigation arrows
- `StatefulReaderArrowButton`: Individual arrow button
- `StatefulRunningHead`: Running head (chapter title)
- `StatefulBackLink`: Back link button

### Hooks
- `useReader()`: Tillgång till reader state och methods
- `useNavigation()`: Navigation methods (next, prev, goto)
- `useProgression()`: Läsprogression state

### StatefulPreferencesProvider
Redux-backed preferences provider:
```typescript
<StatefulPreferencesProvider>
  <StatefulReader />
</StatefulPreferencesProvider>
```

## i18n

Thorium Web använder `react-i18next` för internationalisering.

### ThI18nProvider
```typescript
<ThI18nProvider
  lng="sv"              // Primary language
  fallbackLng="en"      // Fallback language
  ns={["thorium-web", "thorium-shared"]}
  defaultNS="thorium-web"
  backend={{
    loadPath: "/locales/{{lng}}/{{ns}}.json"
  }}
>
  {children}
</ThI18nProvider>
```

**Props:**
- `lng`: Primary language code
- `fallbackLng`: Fallback language
- `ns`: Namespaces (array)
- `defaultNS`: Default namespace
- `backend`: i18next-http-backend config
- `initOptions`: Additional i18next init options

### Translation Files
Struktur:
```
public/locales/
  sv/
    thorium-web.json
    thorium-shared.json
  en/
    thorium-web.json
    thorium-shared.json
```

### Available Languages
Thorium Web stödjer:
- `ar` – Arabiska
- `da` – Danska
- `en` – Engelska
- `et` – Estniska
- `fi` – Finska
- `fr` – Franska
- `it` – Italienska
- `lt` – Litauiska
- `pl` – Polska
- `pt-BR` – Portugisiska (Brasilien)
- `pt-PT` – Portugisiska (Portugal)
- `sv` – Svenska
- `ta` – Tamil
- `tr` – Turkiska
- `uk` – Ukrainska

## Styling

### CSS Stylesheets
Varje package har sina egna stylesheets:
- `@edrlab/thorium-web/core/styles.css`
- `@edrlab/thorium-web/epub/styles.css`
- `@edrlab/thorium-web/misc/styles.css`

Importera alla i din app:
```typescript
import "@edrlab/thorium-web/core/styles.css"
import "@edrlab/thorium-web/epub/styles.css"
import "@edrlab/thorium-web/misc/styles.css"
```

### Class Names
Pattern: `.thorium_web_{module}_{component}`

Exempel:
- `.thorium_web_reader_header`
- `.thorium_web_reader_footer`
- `.thorium_web_reader_pagination`

### StatefulReader State Classes
StatefulReader lägger till state-klasser på root element:
- `.thorium_web_stackedUI` / `.thorium_web_layeredUI`
- `.thorium_web_isReflow` / `.thorium_web_isPaged`
- `.thorium_web_isFxl`
- `.thorium_web_isDocked`
- `.thorium_web_isImmersive`
- `.thorium_web_isFullscreen`

Använd för conditional styling:
```css
.thorium_web_reader_header {
  background: var(--th-theme-background);
}

.thorium_web_isImmersive .thorium_web_reader_header {
  opacity: 0.9;
}
```

### React Aria Component States
React Aria components har data-attributes för states:
- `[data-pressed]`
- `[data-hovered]`
- `[data-focused]`
- `[data-selected]`
- `[data-disabled]`

Använd för styling:
```css
.thorium_web_button[data-pressed] {
  transform: scale(0.98);
}
```

### CSS Custom Properties
Thorium Web exponerar CSS custom properties för theming:

#### Theme Properties (11 st)
- `--th-theme-background`
- `--th-theme-text`
- `--th-theme-text-secondary`
- `--th-theme-link`
- `--th-theme-link-hover`
- `--th-theme-link-active`
- `--th-theme-focus`
- `--th-theme-shade`
- `--th-theme-shade-secondary`
- `--th-theme-border`
- `--th-theme-scrim`

#### Layout Properties (5 st)
- `--th-layout-radius`
- `--th-layout-spacing`
- `--th-layout-header-height`
- `--th-layout-footer-height`
- `--th-layout-dock-width`

#### Sheet Properties (5 st)
- `--th-sheet-width`
- `--th-sheet-max-width`
- `--th-sheet-height`
- `--th-sheet-max-height`
- `--th-sheet-scrim-opacity`

### Customization
Override CSS custom properties i din egen CSS:
```css
:root {
  --th-theme-background: #fafafa;
  --th-layout-radius: 12px;
}
```

## Misc Package

Misc package (`@edrlab/thorium-web/misc`) innehåller utility components.

### StatefulLoader
Loading indicator:
```typescript
<StatefulLoader />
```

### PublicationGrid
Grid för publikationslista:
```typescript
<PublicationGrid publications={publications} />
```

## App-specifika beteenden

> **OBS:** Detta beskriver hur referens-appen i thorium-web-readonly fungerar. Dessa mönster är **EJ obligatoriska** för egna implementationer.

### Settings Pattern: "One-Two Punch"
1. **Ett klick:** Växla preset (small → medium → large)
2. **Två klick:** Öppna avancerade settings

> **Tips:** Detta är EN implementationsstil. Du kan implementera settings på vilket sätt som helst.

### Themes
Themes genereras dynamiskt från preferences (ljus/mörk/sepia/auto) men kan även hårdkodas eller hämtas från API.

### Text Settings

#### Hyphens
- Hyphens styrs via CSS property `hyphens`
- Växlar mellan `auto` (aktiverad) och `manual` (inaktiverad)
- Kräver `lang`-attribut på HTML för korrekt uppdelning

#### Text Normalization
- Font family override (system eller custom)
- Font size, line height, word spacing, letter spacing
- Text align (start/end/left/right/center/justify)

### Spacing Settings

#### Presets
Presets för spacing innehåller:
- `pageGutter`: Padding runt content
- `paragraphSpacing`: Marginal mellan paragrafer
- `paragraphIndent`: Indrag för paragrafer

#### Publisher Styles Toggle
Växlar mellan att respektera publisher styles eller override med reader styles.

### Layout Side Effects
När layout ändras (columns, spread) kan det påverka:
- Pagination
- Progression calculation
- Docked sheet width

### SSR Considerations
- Navigator (Readium TS-Toolkit) kräver DOM/window
- `StatefulReader` måste renderas client-side
- Använd `"use client"` directive i Next.js
- Undvik `window`/`document` åtkomst i SSR

## Bygg & paketering

### Local Development
För att arbeta med Thorium Web lokalt:
```bash
# I thorium-web-readonly/
pnpm bundle    # Bygger paketet
pnpm link      # Länkar lokalt

# I ditt projekt
pnpm link @edrlab/thorium-web
```

### Adding Dependencies
När du lägger till nya beroenden:
1. Lägg till i både `dependencies` och `peerDependencies` i package.json
2. Markera som `external` i `tsup.config.ts`:
   ```typescript
   external: [
     "react",
     "react-dom",
     "next",
     "mitt-nya-bibliotek"
   ]
   ```

## Best Practices & Rekommendationer

### Project Structure
- Använd `src/config/publications.ts` för publikationslista
- Separera reader preferences i `src/reader/preferences.ts`
- Lägg reader-specifik CSS i `src/theme/reader.css`
- Använd `app/` för routing, `src/` för logik

### Customization Approach
1. **Preferences först:** Anpassa via preferences när möjligt
2. **Plugins andra:** Bygg plugins för custom funktionalitet
3. **Fork sista:** Forka endast om absolut nödvändigt

### Accessibility
- Använd React Aria components (built-in WCAG compliance)
- Testa med screen readers (NVDA, JAWS, VoiceOver)
- Säkerställ korrekt keyboard navigation
- Testa focus management vid modal open/close

### Testing
- Testa på olika devices (mobil, tablet, desktop)
- Testa i olika browsers (Chrome, Firefox, Safari, Edge)
- Testa RTL-språk (arabiska etc.)
- Använd accessibility testing tools (axe, WAVE)

### Performance
- Minimera re-renders: använd `useMemo`/`useCallback` med omdöme
- Redux selectors ska vara memoized
- Lazy load components när möjligt
- Optimera bilder (Next.js Image component)
