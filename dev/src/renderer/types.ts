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

      // Needed by getTitle()
      data?: {
        /** &lt;title>${title}&lt;/title> - set by data() hook, has precedence over the onBeforeRender() hook */
        title?: string;
      };

      isHydration?: boolean;

      prefersDark?: boolean | null;
      prefersLang?: string | null;
      viewport?: {
        width?: number | null;
        height?: number | null;
      };
      userAgent?: string | null;
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
       * See https://vike.dev/render-modes
       *
       * @default 'SSR'
       *
       */
      renderMode?: 'HTML' | 'SPA' | 'SSR';

      /**
       * Whether to stream the page's HTML. Requires Server-Side Rendering (`ssr: true`).
       *
       * @default false
       *
       */
      stream?: boolean;

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
