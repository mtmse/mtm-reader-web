import {
  createPreferences,
  defaultPreferences,
  ThActionsKeys,
  ThThemeKeys,
} from "@edrlab/thorium-web/core/preferences";
import type { ThPreferences as Preferences } from "@edrlab/thorium-web/core/preferences";

/**
 * Default preferences for MTM Reader.
 *
 * Customizations:
 * - Light/dark themes with custom colors and opacity
 * - Action menu ordering for reflow and fixed-layout (FXL) formats
 * - Settings panel always visible for easy access to preferences
 *
 * To extend with custom preferences, use createPreferences<CustomKeys>(...).
 * @see thorium-web-readonly/docs/customization/HandlingPreferences.md
 */

export const preferences: Preferences = createPreferences({
  ...defaultPreferences,
  theming: {
    ...defaultPreferences.theming,
    themes: {
      ...defaultPreferences.theming.themes,
      reflowOrder: ["auto", ThThemeKeys.light, ThThemeKeys.dark],
      fxlOrder: ["auto", ThThemeKeys.light, ThThemeKeys.dark],
      systemThemes: {
        light: ThThemeKeys.light,
        dark: ThThemeKeys.dark,
      },
      keys: {
        ...defaultPreferences.theming.themes.keys,
        [ThThemeKeys.light]: {
          background: "#ffffff",
          text: "#000000",
          link: "revert",
          visited: "revert",
          subdue: "#909090",
          disable: "#505050",
          hover: "#f4e8f3",
          onHover: "#000000",
          select: "#e4c7e0",
          onSelect: "#000000",
          focus: "#0582cb",
          elevate: "none",
          immerse: "1",
        },
        [ThThemeKeys.dark]: {
          background: "#1a1a1a",
          text: "#ffffff",
          link: "revert",
          visited: "revert",
          subdue: "#505050",
          disable: "#909090",
          hover: "#2a2a2a",
          onHover: "#ffffff",
          select: "#3a2a38",
          onSelect: "#ffffff",
          focus: "#0582cb",
          elevate: "none",
          immerse: "0.9",
        },
      },
    },
  },
  actions: {
    ...defaultPreferences.actions,
    reflowOrder: [
      ThActionsKeys.settings,
      ThActionsKeys.toc,
      ThActionsKeys.jumpToPosition,
      ThActionsKeys.fullscreen,
    ],
    fxlOrder: [
      ThActionsKeys.settings,
      ThActionsKeys.toc,
      ThActionsKeys.fullscreen,
      ThActionsKeys.jumpToPosition,
    ],
    keys: {
      ...defaultPreferences.actions.keys,
      [ThActionsKeys.settings]: {
        ...defaultPreferences.actions.keys[ThActionsKeys.settings],
        visibility: "always",
      },
      [ThActionsKeys.toc]: {
        ...defaultPreferences.actions.keys[ThActionsKeys.toc],
        visibility: "partially",
      },
      [ThActionsKeys.fullscreen]: {
        ...defaultPreferences.actions.keys[ThActionsKeys.fullscreen],
        visibility: "partially",
      },
    },
  },
});

export default preferences;