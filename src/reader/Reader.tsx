"use client";

import {
  StatefulReader,
  ThI18nProvider,
  ThPreferencesProvider,
  ThStoreProvider,
} from "@edrlab/thorium-web/epub";

import preferences from "./preferences";

/**
 * Reader component wrapping StatefulReader with Thorium Web providers.
 *
 * Provider hierarchy (outermost to innermost):
 * 1. ThStoreProvider - Redux store for reader state
 * 2. ThPreferencesProvider - User preferences (themes, typography, etc.)
 * 3. ThI18nProvider - Internationalization with i18next
 * 4. StatefulReader - Core EPUB reader
 *
 * @see https://github.com/edrlab/thorium-web-readonly for documentation
 */
export type ReaderProps = {
  manifest: object;
  selfHref: string;
};

export default function Reader({ manifest, selfHref }: ReaderProps) {
  const defaultLanguage = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "sv";
  return (
    <ThStoreProvider>
      <ThPreferencesProvider initialPreferences={preferences}>
        <ThI18nProvider
          lng={defaultLanguage}
          fallbackLng="en"
          ns={["thorium-web", "thorium-shared"]}
          defaultNS="thorium-web"
          backend={{
            loadPath: "/locales/{{lng}}/{{ns}}.json",
          }}
        >
          <StatefulReader rawManifest={manifest} selfHref={selfHref} />
        </ThI18nProvider>
      </ThPreferencesProvider>
    </ThStoreProvider>
  );
}