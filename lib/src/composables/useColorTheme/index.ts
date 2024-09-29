import type { CSSProperties, MaybeRef, MaybeRefOrGetter, ShallowRef } from 'vue';

import { shallowRef, toValue, unref, watchSyncEffect } from 'vue';

import type { ColorTheme, ColorThemeCustomColor, ColorThemeSchemeVariants } from './theme';

import { getColorThemeStyles } from './style';
import { colorThemeFromSourceColor } from './theme';

export type { ColorThemeScheme, ColorThemeSchemeKeys } from './scheme';
export type { ColorThemeStyleOptions } from './style';
export type {
  ColorTheme,
  ColorThemeCustomColor,
  ColorThemeCustomColorGroup,
  ColorThemeOptions,
  colorThemeSchemeVariants,
  ColorThemeSchemeVariants,
} from './theme';

/**
 * Options for `useColorTheme`.
 *
 * @public
 */
export interface UseColorThemeOptions {
  /** Source color for scheme generator as a hex string or as a number (argb). */
  source: MaybeRefOrGetter<string | number>;
  /**
   * List of custom colors to be added in the theme.
   *
   * @defaultValue `[]`
   */
  customColors?: MaybeRefOrGetter<ColorThemeCustomColor[] | null>;
  /**
   * Contrast level for scheme generator.
   *
   * @defaultValue `0`
   */
  contrastLevel?: MaybeRefOrGetter<number | null>;
  /**
   * Variant of scheme generator.
   *
   * @defaultValue `TonalSpot`
   * @see {@link https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/creating_color_scheme.md}
   */
  variant?: MaybeRefOrGetter<ColorThemeSchemeVariants | null>;
}

/**
 * Creates and returns a reactive Material Design 3 theme created from `source` color.
 *
 * @public
 * @param options - Reactive options for `useTheme`.
 * @returns Reactive Material Design 3 theme.
 */
export function useColorTheme(options: UseColorThemeOptions) {
  const colorTheme = shallowRef<ColorTheme>();

  watchSyncEffect(() => {
    colorTheme.value = colorThemeFromSourceColor(toValue(options.source), {
      customColors: toValue(options.customColors) || [],
      contrastLevel: toValue(options.contrastLevel) || undefined,
      variant: toValue(options.variant) || undefined,
    });
  });

  return colorTheme as ShallowRef<ColorTheme>;
}

/**
 * Options for `useColorThemeStyle`.
 *
 * @public
 */
export interface UseColorThemeStyleOptions {
  /** Source Material Design 3 theme (can be created with `useTheme`). */
  colorTheme: MaybeRefOrGetter<ColorTheme>;
  /** Generate light/dark/auto styles. */
  isDark?: MaybeRefOrGetter<boolean | null>;
  /** List of indexes in the tonal palette to generate as CSS variables. */
  paletteTones?: MaybeRefOrGetter<number[] | null>;
  /** Format used to represent the colors. */
  format?: MaybeRefOrGetter<'hex' | 'rgb' | null>;
  /**
   * Filtering function to be used to reduce the number of CSS variables generated.
   * Receives the name and value of the CSS variable to be generated.
   */
  filterFn?: MaybeRef<([ key, val ]: [ string, string ]) => boolean>;
  /**
   * List of filtering options to be used to reduce the number of CSS variables generated.
   * Will be checked against the name of the CSS variable to be generated.
   * A variable will be generated if any of the checks passes.
   */
  filter?: MaybeRefOrGetter<(string | RegExp)[]>;
}

/**
 * Returns an object with HTML dataset and CSS variables (tokens generated from a Material Design 3 theme) to be applied to an HTML element.
 *
 * @public
 * @param options - Reactive options for `useThemeStyle`.
 * @returns An object with `attrs` (HTML dataset) and `style` (CSS variables) to be applied to an HTML element.
 */
export function useColorThemeStyle(options: UseColorThemeStyleOptions) {
  const colorThemeStyle: {
    attrs: ShallowRef<DOMStringMap | null>;
    style: ShallowRef<CSSProperties | null>;
  } = {
    attrs: shallowRef(null),
    style: shallowRef(null),
  };

  watchSyncEffect(() => {
    const isDark = toValue(options.isDark);
    const colorScheme = isDark == null
      ? 'auto'
      : (isDark ? 'dark' : 'light');

    colorThemeStyle.attrs.value = { 'data-sv-color-scheme': colorScheme };
    colorThemeStyle.style.value = getColorThemeStyles(toValue(options.colorTheme), {
      isDark,
      paletteTones: toValue(options.paletteTones) || [],
      format: toValue(options.format) || 'hex',
      filterFn: unref(options.filterFn),
      filter: toValue(options.filter),
    });
  });

  return colorThemeStyle as {
    attrs: ShallowRef<DOMStringMap>;
    style: ShallowRef<CSSProperties>;
  };
}
