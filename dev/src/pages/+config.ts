import type { Config } from 'vike/types';
import Layout from '$dev/layouts/LayoutDefault.vue';
import Head from '$dev/layouts/HeadDefault.vue';
import logoUrl from '$dev/assets/media/logo.svg';

export default {
  Layout,
  Head,

  title: 'SmartVui Demo',
  description: 'Demo showcasing SmartVui',
  favicon: logoUrl,

  stream: true,
} satisfies Config;
