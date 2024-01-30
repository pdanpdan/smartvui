import type { Config, ConfigEffect, ConfigEnv } from 'vike/types';

// Depending on the value of `config.meta.renderMode`, set other config options' `env`
// accordingly.
// See https://vike.dev/meta#modify-existing-configurations
const toggleRenderRelatedConfig: ConfigEffect = ({ configDefinedAt, configValue }) => {
  let env: ConfigEnv | undefined;
  switch (configValue) {
    case 'HTML':
      env = { server: true };
      break;
    case 'SPA':
      env = { client: true };
      break;
    case 'SSR':
      env = { server: true, client: true };
      break;
    default:
      throw new Error(`${ configDefinedAt } should be 'SSR', 'SPA', or 'HTML'`);
  }

  return {
    meta: {
      // When the SSR flag is false, we want to render the page only in the
      // browser. We achieve this by then making the `Page` implementation
      // accessible only in the client's renderer.
      Page: { env },
    },
  };
};

// https://vike.dev/config
export default {
  // A page can define an onBeforeRender() hook to be run on the server, which
  // can fetch data and return it as additional page context. Typically it will
  // return the page's root Vue component's props and additional data that can
  // be used by the renderers.
  // It is a cumulative config option, so a web app using vike-vue can extend
  // this list.
  passToClient: [
    'pageProps',
    'routeParams',
    'title',
    'is404',

    'prefersDark',
    'prefersLang',
    'isMobile',
    'platform',
    'userAgent',
  ],
  clientRouting: true,
  hydrationCanBeAborted: true,
  prefetchStaticAssets: 'viewport',

  // https://vike.dev/meta
  meta: {
    lang: {
      env: { server: true },
    },
    favicon: {
      env: { server: true },
    },
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },

    Head: {
      env: { server: true },
    },
    Layout: {
      env: { server: true, client: true },
    },

    renderMode: {
      env: { config: true },
      effect: toggleRenderRelatedConfig,
    },

    stream: {
      env: { server: true },
    },

    vuePlugins: {
      // List of vue plugins to be installed with app.vue() in onRenderHtml and
      // onRenderClient. We make this config available both on the server and
      // the client always, but if SSR is disabled, onRenderHtml won't make use
      // of it.
      env: { server: true, client: true },
    },
  },
} satisfies Config;
