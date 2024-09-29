import type { DynamicScheme } from '@material/material-color-utilities';

import { MaterialDynamicColors } from '@material/material-color-utilities';

const keys = [
  'background',
  'onBackground',
  'surface',
  'surfaceDim',
  'surfaceBright',
  'surfaceContainerLowest',
  'surfaceContainerLow',
  'surfaceContainer',
  'surfaceContainerHigh',
  'surfaceContainerHighest',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'inverseSurface',
  'inverseOnSurface',
  'outline',
  'outlineVariant',
  'shadow',
  'scrim',
  'surfaceTint',
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'inversePrimary',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'primaryFixed',
  'primaryFixedDim',
  'onPrimaryFixed',
  'onPrimaryFixedVariant',
  'secondaryFixed',
  'secondaryFixedDim',
  'onSecondaryFixed',
  'onSecondaryFixedVariant',
  'tertiaryFixed',
  'tertiaryFixedDim',
  'onTertiaryFixed',
  'onTertiaryFixedVariant',
] as const;

/**
 * Keys of the generated colors from `MaterialDynamicColors`.
 *
 * @public
 * @see {@link https://github.com/material-foundation/material-color-utilities/blob/main/dev_guide/creating_color_scheme.md}
 */
export type ColorThemeSchemeKeys = 'background' | 'onBackground'
  | 'surface' | 'surfaceDim' | 'surfaceBright' | 'onSurface'
  | 'surfaceContainerLowest' | 'surfaceContainerLow' | 'surfaceContainer' | 'surfaceContainerHigh' | 'surfaceContainerHighest'
  | 'surfaceVariant' | 'onSurfaceVariant'
  | 'inverseSurface' | 'inverseOnSurface'
  | 'surfaceTint'
  | 'outline' | 'outlineVariant'
  | 'shadow' | 'scrim'
  | 'primary' | 'onPrimary' | 'primaryContainer' | 'onPrimaryContainer' | 'inversePrimary'
  | 'primaryFixed' | 'primaryFixedDim' | 'onPrimaryFixed' | 'onPrimaryFixedVariant'
  | 'secondary' | 'onSecondary' | 'secondaryContainer' | 'onSecondaryContainer'
  | 'secondaryFixed' | 'secondaryFixedDim' | 'onSecondaryFixed' | 'onSecondaryFixedVariant'
  | 'tertiary' | 'onTertiary' | 'tertiaryContainer' | 'onTertiaryContainer'
  | 'tertiaryFixed' | 'tertiaryFixedDim' | 'onTertiaryFixed' | 'onTertiaryFixedVariant'
  | 'error' | 'onError' | 'errorContainer' | 'onErrorContainer';

/**
 * Type for a generated Material Design 3 scheme.
 *
 * @public
 */
export type ColorThemeScheme = Record<ColorThemeSchemeKeys, number>;

/**
 * Generate a Material Design 3 scheme from a `DynamicScheme`.
 *
 * @public
 * @param scheme - a source `DynamicScheme`.
 * @returns Material Design 3 scheme of colors to be used for themes.
 */
export function scheme(scheme: DynamicScheme) {
  return Object.fromEntries(keys.map((key) =>
    [ key, MaterialDynamicColors[ key ].getArgb(scheme) ],
  )) as ColorThemeScheme;
}
