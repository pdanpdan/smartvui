import type { App } from 'vue';

import { version } from '../package.json';

import * as components from './components';
import * as composables from './composables';

export default (app: App) => {
  for (const componentName in components) {
    app.component(componentName, (components as Record<string, Parameters<typeof app.component>[ 1 ]>)[ componentName ]);
  }
};

export {
  version,

  components,
  composables,
};
