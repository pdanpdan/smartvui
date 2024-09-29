// https://vike.dev/onCreateApp
import type { OnCreateAppSync } from 'vike-vue/types';

import 'virtual:uno.css';

import '$dev/assets/styles/index.sass';
import { SmartVui, usePlatform, usePrefersDark, useScreen } from '$lib/index';

export const onCreateApp: OnCreateAppSync = (pageContext): ReturnType<OnCreateAppSync> => {
  if (pageContext.isRenderingHead) {
    return;
  }

  const { app } = pageContext;
  app.use(SmartVui, {
    // composables: {
    //   usePlatform: [ usePlatform, { forceUserAgent: pageContext.forceUserAgent } ],
    //   useScreen: [ useScreen, pageContext.viewport ],
    // },
    composables: [
      [ usePlatform, { forceUserAgent: pageContext.forceUserAgent } ],
      [ useScreen, pageContext.viewport ],
      usePrefersDark,
    ],
  });
};
