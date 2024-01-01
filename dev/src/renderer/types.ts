import type { Plugin, defineAsyncComponent, defineComponent } from 'vue';

export type Component = ReturnType<typeof defineComponent> | ReturnType<typeof defineAsyncComponent>;
export type PageProps = Record<string, unknown>;

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Component;
      pageProps?: PageProps;
      config: Config;
      /** Title defined dynamically by onBeforeRender() */
      title?: string;
      abortReason?: string;

      isHydration?: boolean;

      prefersDark?: boolean | null;
      prefersLang?: string | null;
      isMobile?: boolean | null;
      platform?: string | null;
    }

    interface Config {
      /** Vue component rendered and appended into &lt;head>&lt;/head> */
      Head?: Component;
      Layout?: Component;
      /** &lt;title>${title}&lt;/title> */
      title?: string | ((pageContext: PageContext) => string);
      /** &lt;meta name="description" content="${description}" /> */
      description?: string;
      /** &lt;link rel="icon" href="${favicon}" /> */
      favicon?: string;
      /**
       * &lt;html lang="${lang}">
       *
       *  @default 'en'
       *
       */
      lang?: string;
      /**
       * If true, render mode is SSR or pre-rendering (aka SSG). In other words, the
       * page's HTML will be rendered at build-time or request-time.
       * If false, render mode is SPA. In other words, the page will only be
       * rendered in the browser.
       *
       * See https://vike.dev/render-modes
       *
       * @default true
       *
       */
      renderMode?: 'HTML' | 'SPA' | 'SSR';
      /**
       * List of Vue plugins (and their respective options) to be installed with
       * `app.vue(plugin, options)`.
       *
       * See https://vuejs.org/guide/reusability/plugins.html
       *
       * @default []
       *
       */
      vuePlugins?: {
        plugin: Plugin;
        options?: unknown;
      }[];
      /** The page's root Vue component */
      Page?: Component;
    }
  }
}
