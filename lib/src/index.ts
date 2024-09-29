import type { Plugin } from 'vue';

import { install } from '$lib/install';
import { libVersion } from '$lib/libraryInfo';

export * from '$lib/components';
export * from '$lib/composables';

export type * from '$lib/install';
export type * from '$lib/utils/animation';
export type * from '$lib/utils/types';

export type { ViteImportCssPluginConfig } from '$lib/plugins/viteImportCssPlugin';
export { viteImportCssPlugin } from '$lib/plugins/viteImportCssPlugin';

export type { UnpluginVueComponentsSmartVuiResolverConfig } from '$lib/plugins/unpluginVueComponentsSmartVuiResolver';
export { unpluginVueComponentsSmartVuiResolver } from '$lib/plugins/unpluginVueComponentsSmartVuiResolver';

/**
 * SmartVui Vue plugin.
 *
 * @public
 */
export const SmartVui = {
  version: libVersion,

  install,
} satisfies Plugin & { version: string; };
