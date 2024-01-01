import { shallowRef, unref, watchEffect } from 'vue';
import type { CSSProperties, MaybeRef, ShallowRef } from 'vue';
import { getThemeStyles } from './style';
import { themeFromSourceColor } from './theme';
import type { CustomColor, Theme, ThemeSchemeVariants } from './theme';

export type { omitKeys, Key, Scheme } from './scheme';
export type { ThemeStyleOptions } from './style';
export type {
  schemes,
  CustomColor,
  CustomColorGroup,
  Theme,
  ThemeOptions,
  ThemeSchemeVariants,
} from './theme';

/**
 * Options for `useTheme`.
 * @public
 */
export interface UseThemeOptions {
  /** Source color for scheme generator as a hex string or as a number (argb). */
  source: MaybeRef<string | number>;
  /**
   * List of custom colors to be added in the theme.
   * @defaultValue `[]`
   */
  customColors?: MaybeRef<CustomColor[] | null>;
  /**
   * Contrast level for scheme generator.
   * @defaultValue `0`
   */
  contrastLevel?: MaybeRef<number | null>;
  /**
   * Variant of scheme generator.
   * @defaultValue `TonalSpot`
   * @see {@link https://github.com/material-foundation/material-color-utilities/blob/main/make_schemes.md#swift-1}
   */
  variant?: MaybeRef<ThemeSchemeVariants | null>;
}

/**
 * Creates and returns a reactive Material Design 3 theme created from `source` color.
 * @public
 * @param options - Reactive options for `useTheme`.
 * @returns Reactive Material Design 3 theme.
 */
export function useTheme(options: UseThemeOptions) {
  const theme = shallowRef<Theme>();

  watchEffect(() => {
    theme.value = themeFromSourceColor(unref(options.source), {
      customColors: unref(options.customColors) || [],
      contrastLevel: unref(options.contrastLevel) || undefined,
      variant: unref(options.variant) || undefined,
    });
  });

  return theme as ShallowRef<Theme>;
};

/**
 * Options for `useThemeStyle`.
 * @public
 */
export interface UseThemeStyleOptions {
  /** Source Material Design 3 theme (can be created with `useTheme`). */
  theme: MaybeRef<Theme>;
  /** Generate light/dark/auto styles. */
  isDark?: MaybeRef<boolean | null>;
  /** List of indexes in the tonal palette to generate as CSS variables. */
  paletteTones?: MaybeRef<number[] | null>;
  /** Format used to represent the colors. */
  format?: MaybeRef<'hex' | 'rgb' | null>;
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
  filter?: MaybeRef<(string | RegExp)[]>;
}

/**
 * Returns an object with HTML dataset and CSS variables (tokens generated from a Material Design 3 theme) to be applied to an HTML element.
 * @public
 * @param options - Reactive options for `useThemeStyle`.
 * @returns An object with `attrs` (HTML dataset) and `style` (CSS variables) to be applied to an HTML element.
 */
export function useThemeStyle(options: UseThemeStyleOptions) {
  const themeStyle: {
    attrs: ShallowRef<DOMStringMap | null>;
    style: ShallowRef<CSSProperties | null>;
  } = {
    attrs: shallowRef(null),
    style: shallowRef(null),
  };

  watchEffect(() => {
    const isDark = unref(options.isDark);
    const themeType = isDark == null
      ? 'auto'
      : (isDark ? 'dark' : 'light');

    themeStyle.attrs.value = { 'data-sv-theme': themeType };
    themeStyle.style.value = getThemeStyles(unref(options.theme), {
      isDark,
      paletteTones: unref(options.paletteTones) || [],
      format: unref(options.format) || 'hex',
      filterFn: unref(options.filterFn),
      filter: unref(options.filter),
    });
  });

  return themeStyle as {
    attrs: ShallowRef<DOMStringMap>;
    style: ShallowRef<CSSProperties>;
  };
};
