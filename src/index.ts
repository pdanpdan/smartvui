import type { Plugin } from 'vue';

import install, { components, composables, version } from './install';

/**
 * @public
 */
const SmartVuiPlugin: Plugin = {
  install,
};

export default SmartVuiPlugin;

export {
  version,

  install,

  components,
  composables,
};
