import type { ColorGroup } from '@material/material-color-utilities';
import type { CSSProperties } from 'vue';

import {
  hexFromArgb,
  rgbaFromArgb,
} from '@material/material-color-utilities';

import type { ColorThemeScheme } from './scheme';
import type { ColorTheme } from './theme';

type CSSPropertyKey = `--${ string }`;

/**
 * Options for `getColorThemeStyles`.
 *
 * @public
 */
export interface ColorThemeStyleOptions {
  /** Generate light/dark/auto styles. */
  isDark?: boolean | null;
  /** List of indexes in the tonal palette to generate as CSS variables. */
  paletteTones?: number[];
  /** Format used to represent the colors. */
  format?: 'hex' | 'rgb';
  /**
   * Filtering function to be used to reduce the number of CSS variables generated.
   * Receives the name and value of the CSS variable to be generated.
   */
  filterFn?: ([ key, val ]: [ string, string ]) => boolean;
  /**
   * List of filtering options to be used to reduce the number of CSS variables generated.
   * Will be checked against the name of the CSS variable to be generated.
   * A variable will be generated if any of the checks passes.
   */
  filter?: (string | RegExp)[];
}

/**
 * Generate CSS variables (tokens generated from a Material Design 3 theme) to be applied to an HTML element.
 *
 * @public
 * @param colorTheme - source Material Design 3 `colorTheme`
 * @param options - options for `getColorThemeStyles`.
 * @returns CSS variables (tokens generated from a Material Design 3 theme) to be applied to an HTML element.
 */
export function getColorThemeStyles(colorTheme: ColorTheme, options?: ColorThemeStyleOptions) {
  const style: CSSProperties = {};
  const isDark = typeof options?.isDark === 'boolean' ? options.isDark : null;
  const format = options?.format === 'rgb' ? 'rgb' : 'hex';

  if (isDark !== null) {
    setColorThemeStyleValues(style, isDark ? colorTheme.schemes.dark : colorTheme.schemes.light, '', format);
    colorTheme.customColors.forEach(({ color, dark, light }) => {
      setColorThemeStyleCustomColorValues(style, color.name, isDark ? dark : light, '', format);
    });
  } else {
    setColorThemeStyleValues(style, colorTheme.schemes.dark, '-dark', format);
    setColorThemeStyleValues(style, colorTheme.schemes.light, '-light', format);
    colorTheme.customColors.forEach(({ color, dark, light }) => {
      setColorThemeStyleCustomColorValues(style, color.name, dark, '-dark', format);
      setColorThemeStyleCustomColorValues(style, color.name, light, '-light', format);
    });
  }

  if (Array.isArray(options?.paletteTones)) {
    const tones = options.paletteTones;
    for (const [ key, palette ] of Object.entries(colorTheme.palettes)) {
      const paletteKey = key.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      for (const tone of tones) {
        const token: CSSPropertyKey = `--md-ref-palette-${ paletteKey }${ tone }`;
        const color = options?.format === 'rgb'
          ? Object.values(rgbaFromArgb(palette.tone(tone))).slice(0, -1).join(' ')
          : hexFromArgb(palette.tone(tone));
        style[ token ] = color;
      }
    }

    colorTheme.customColors.forEach(({ color: { name }, palette }) => {
      const paletteKey = name.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replaceAll(/[^a-z0-9]/g, '');
      for (const tone of tones) {
        const token: CSSPropertyKey = `--md-ref-palette-${ paletteKey }${ tone }`;
        const color = options?.format === 'rgb'
          ? Object.values(rgbaFromArgb(palette.tone(tone))).slice(0, -1).join(' ')
          : hexFromArgb(palette.tone(tone));
        style[ token ] = color;
      }
    });
  }

  if (options?.filterFn != null) {
    return Object.fromEntries(Object.entries(style).filter(options.filterFn));
  }
  if (Array.isArray(options?.filter) && options.filter.length > 0) {
    const filterStr = options.filter.filter((f): f is string => typeof f === 'string');
    const filterRegExp = options.filter.filter((f): f is RegExp => f instanceof RegExp);
    return Object.fromEntries(Object.entries(style).filter(([ key ]) => filterStr.some((f) => key.includes(f)) || filterRegExp.some((f) => f.test(key))));
  }

  return style;
}

function setColorThemeStyleValues(
  style: CSSProperties,
  scheme: ColorThemeScheme,
  suffix: string = '',
  format: 'hex' | 'rgb' = 'hex',
) {
  for (const [ key, value ] of Object.entries(scheme)) {
    const token: CSSPropertyKey = `--md-sys-color-${ key.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() }${ suffix }`;
    const color = format === 'rgb'
      ? Object.values(rgbaFromArgb(value)).slice(0, -1).join(' ')
      : hexFromArgb(value);
    style[ token ] = color;
  }
}

function setColorThemeStyleCustomColorValues(
  style: CSSProperties,
  name: string,
  scheme: ColorGroup,
  suffix: string = '',
  format: 'hex' | 'rgb' = 'hex',
) {
  name = name.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replaceAll(/[^a-z0-9]/g, '');
  for (const [ key, value ] of Object.entries(scheme)) {
    const token: CSSPropertyKey = `--md-sys-color-${ key.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace('color', name) }${ suffix }`;
    const color = format === 'rgb'
      ? Object.values(rgbaFromArgb(value)).slice(0, -1).join(' ')
      : hexFromArgb(value);
    style[ token ] = color;
  }
}
