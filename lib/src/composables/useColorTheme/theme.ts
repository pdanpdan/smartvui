import type {
  CustomColorGroup as CustomColorGroupMCU,
  CustomColor as CustomColorMCU,
  TonalPalette,
} from '@material/material-color-utilities';

import {
  argbFromHex,
  Blend,
  CorePalette,
  Hct,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeTonalSpot,
  SchemeVibrant,
} from '@material/material-color-utilities';

import type { ColorThemeScheme } from './scheme';

import { scheme } from './scheme';

/**
 * Type for `CustomColor` to be added to a Material Design 3 `theme`.
 *
 * @public
 */
export type ColorThemeCustomColor = Omit<CustomColorMCU, 'value'> & {
  /** Source color for scheme generator as a hex string or as a number (argb). */
  value: number | string;
};

/**
 * Type for `CustomColorGroup` that is generated from a `CustomColor`.
 *
 * @public
 */
export type ColorThemeCustomColorGroup = CustomColorGroupMCU & {
  /** Tonal palette. */
  palette: TonalPalette;
};

/**
 * Generated Material Design 3 `theme`.
 *
 * @public
 */
export interface ColorTheme {
  /** Source color for scheme generator as a hex string or as a number (argb). */
  source?: number;
  /** Color schemes for light/dark mode. */
  schemes: {
    /** Color scheme for light mode. */
    light: ColorThemeScheme;
    /** Color scheme for dark mode. */
    dark: ColorThemeScheme;
  };
  /** Tonal palettes for colors. */
  palettes: {
    /** Tonal palette for primary color. */
    primary: TonalPalette;
    /** Tonal palette for secondary color. */
    secondary: TonalPalette;
    /** Tonal palette for tertiary color. */
    tertiary: TonalPalette;
    /** Tonal palette for error color. */
    error: TonalPalette;
    /** Tonal palette for neutral color. */
    neutral: TonalPalette;
    /** Tonal palette for neutralVariant color. */
    neutralVariant: TonalPalette;
  };
  /** List of custom colors */
  customColors: ColorThemeCustomColorGroup[];
}

/**
 * List of variants of scheme generator.
 *
 * @public
 * @see {@link https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/creating_color_scheme.md}
 */
export const colorThemeSchemeVariants = {
  Content: SchemeContent,
  Expressive: SchemeExpressive,
  Fidelity: SchemeFidelity,
  Monochrome: SchemeMonochrome,
  Neutral: SchemeNeutral,
  TonalSpot: SchemeTonalSpot,
  Vibrant: SchemeVibrant,
} as const;

/**
 * Type of variants of scheme generator.
 *
 * @public
 * @see {@link https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/creating_color_scheme.md}
 */
export type ColorThemeSchemeVariants = keyof typeof colorThemeSchemeVariants;

/**
 * Options for `colorThemeFromSourceColor`.
 *
 * @public
 */
export interface ColorThemeOptions {
  /**
   * List of custom colors to be added in the theme.
   *
   * @defaultValue `[]`
   */
  customColors?: ColorThemeCustomColor[];
  /**
   * Contrast level for scheme generator.
   *
   * @defaultValue `0`
   */
  contrastLevel?: number;
  /**
   * Variant of scheme generator.
   *
   * @defaultValue `TonalSpot`
   * @see {@link https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/creating_color_scheme.md}
   */
  variant?: ColorThemeSchemeVariants;
}

function hexToNum(source: number | string): number {
  return typeof source === 'string'
    ? argbFromHex(source)
    : source;
}

/**
 * Generate a `CustomColorGroup` from a custom color.
 *
 * @public
 * @param source - `source` color of a theme (used to harmonize the custom color).
 * @param color - `CustomColor`.
 * @returns `CustomColorGroup` generated from a custom color.
 */
export function customColor(source: number, color: ColorThemeCustomColor): ColorThemeCustomColorGroup {
  let value = typeof color.value === 'string' ? argbFromHex(color.value) : color.value;
  const from = value;
  const to = source;
  if (color.blend) {
    value = Blend.harmonize(from, to);
  }
  const palette = CorePalette.of(value).a1;

  return {
    color: { ...color, value: from },
    value,
    palette,
    light: {
      color: palette.tone(40),
      onColor: palette.tone(100),
      colorContainer: palette.tone(90),
      onColorContainer: palette.tone(10),
    },
    dark: {
      color: palette.tone(80),
      onColor: palette.tone(20),
      colorContainer: palette.tone(30),
      onColorContainer: palette.tone(90),
    },
  };
}

/**
 * Generate a Material Design 3 `colorTheme` from a `source` color.
 *
 * @public
 * @param source - Source color for scheme generator as a hex string or as a number (argb).
 * @param options - Options for `themeFromSourceColor`.
 * @returns Material Design 3 `theme`.
 */
export function colorThemeFromSourceColor(
  source: number | string,
  options: ColorThemeOptions = {},
): ColorTheme {
  const sourceNum = hexToNum(source);
  const light = new colorThemeSchemeVariants[ options.variant ?? 'TonalSpot' ](Hct.fromInt(sourceNum), false, options.contrastLevel ?? 0);
  const dark = new colorThemeSchemeVariants[ options.variant ?? 'TonalSpot' ](Hct.fromInt(sourceNum), true, options.contrastLevel ?? 0);

  return {
    source: sourceNum,

    schemes: {
      dark: scheme(dark),
      light: scheme(light),
    },

    palettes: {
      primary: light.primaryPalette,
      secondary: light.secondaryPalette,
      tertiary: light.tertiaryPalette,
      error: light.errorPalette,
      neutral: light.neutralPalette,
      neutralVariant: light.neutralVariantPalette,
    },

    customColors: Array.isArray(options.customColors)
      ? options.customColors.map((color) => customColor(sourceNum, color))
      : [],
  };
}
