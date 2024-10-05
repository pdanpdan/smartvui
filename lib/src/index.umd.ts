import type { App } from 'vue';

import * as components from '$lib/components';
import * as composables from '$lib/composables';
import { install } from '$lib/install';
import { libVersion } from '$lib/libraryInfo';
import '$lib/style/base/index.sass';
import { isClient } from '$lib/utils/is';

declare global {
  interface Window {
    Vue?: unknown;
    SmartVui?: unknown;
  }
}

if (!isClient || window.Vue == null) {
  throw new Error('[ SmartVui ] Vue is required to run. Please add a script tag for it before loading SmartVui.');
}

const SmartVui = {
  version: libVersion,

  install(app: App) {
    install(app, {
      components,
      composables,
    });
  },

  ...components,
  ...composables,
};

(window as Window).SmartVui = SmartVui;

export default SmartVui;
