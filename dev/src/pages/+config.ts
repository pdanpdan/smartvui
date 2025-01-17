import type { Config } from 'vike/types';

import vikeVue from 'vike-vue/config';

import logoUrl from '$dev/assets/media/logo.svg';
import Head from '$dev/layouts/HeadDefault.vue';
import Layout from '$dev/layouts/LayoutDefault.vue';

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  Head,

  title: 'SmartVui Demo',
  description: 'Demo showcasing SmartVui',
  favicon: logoUrl,
  viewport: null,

  stream: 'web',

  passToClient: [
    'prefersDark',
    'prefersLang',
    'viewport',
    'forceUserAgent',
  ],

  extends: vikeVue as typeof vikeVue,
} satisfies Config;
