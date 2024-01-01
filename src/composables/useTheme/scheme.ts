import { MaterialDynamicColors } from '@material/material-color-utilities';
import type { DynamicScheme } from '@material/material-color-utilities';

/**
 * List of keys from `MaterialDynamicColors` to be ignored when generating colors.
 * @public
 * @see {@link https://github.com/material-foundation/material-color-utilities/blob/main/make_schemes.md#swift-1}
 */
export const omitKeys = [
  'contentAccentToneDelta',
  'highestSurface',
  'neutralPaletteKeyColor',
  'neutralVariantPaletteKeyColor',
  'primaryPaletteKeyColor',
  'prototype',
  'secondaryPaletteKeyColor',
  'tertiaryPaletteKeyColor',
] as const;

/**
 * Type for keys of the generated colors from `MaterialDynamicColors`.
 * @public
 * @see {@link https://github.com/material-foundation/material-color-utilities/blob/main/make_schemes.md#swift-1}
 */
export type Key = keyof Omit<typeof MaterialDynamicColors, typeof omitKeys[ number ]>;

const keys = Object.keys(MaterialDynamicColors)
  .filter((key) => omitKeys.includes(key as typeof omitKeys[number]) === false) as Key[];

/**
 * Type for a generated Material Design 3 scheme.
 * @public
 */
export type Scheme = Record<Key, number>;

/**
 * Generate a Material Design 3 scheme from a `DynamicScheme`.
 * @public
 * @param scheme - a source `DynamicScheme`.
 * @returns Material Design 3 scheme of colors to be used for themes.
 */
export function scheme(scheme: DynamicScheme) {
  return Object.fromEntries(keys.map((key) =>
    [ key, MaterialDynamicColors[ key ].getArgb(scheme) ],
  )) as Scheme;
};
