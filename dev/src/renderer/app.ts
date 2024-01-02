import { createApp as createSPAApp, createSSRApp, defineComponent, h, markRaw, nextTick, reactive } from 'vue';
import type { Config, PageContext } from 'vike/types';
import { setPageContext } from '$dev/renderer/usePageContext';
import objectAssign from '$dev/utils/objectAssign';
import type { Component, PageProps } from '$dev/renderer/types';

import '$lib/style/tokens/typography.sass';
import '$lib/style/tokens/colors.sass';
import '$lib/style/base/index.sass';
import '$lib/style/themes/index.sass';

import '$dev/assets/styles/index.sass';

export function createApp(pageContext: PageContext, ssrApp: boolean = false, renderHead: boolean = false) {
  const { Page } = pageContext;
  const Head = renderHead ? pageContext.config.Head : undefined;

  let rootComponent: Component & { Page: Component; pageProps: PageProps; config: Config };
  const PageWithLayout = defineComponent({
    data: () => ({
      Page: markRaw(Head || Page),
      pageProps: markRaw(pageContext.pageProps || {}),
      config: markRaw(pageContext.config),
    }),
    created() {
      // eslint-disable-next-line ts/no-this-alias
      rootComponent = this;
    },
    render() {
      if (this.config.Layout && !renderHead) {
        return h(this.config.Layout, {}, {
          default: () => this.Page === null ? null : h(this.Page, this.pageProps),
        });
      }

      return this.Page === null ? null : h(this.Page, this.pageProps);
    },
  });

  const app = ssrApp ? createSSRApp(PageWithLayout) : createSPAApp(PageWithLayout);

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `+onRenderClient.ts`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext);

  // We use `app.changePage()` to do Client Routing, see `+onRenderClient.ts`
  objectAssign(app, {
    changePage: async (pageContext: PageContext) => {
      let returned = false;
      let err: unknown;
      app.config.errorHandler = (err_) => {
        if (returned) {
          console.error(err_);
        } else {
          err = err_;
        }
      };

      Object.assign(pageContextReactive, pageContext);
      rootComponent.Page = markRaw(pageContext.Page);
      rootComponent.pageProps = markRaw(pageContext.pageProps || {});
      rootComponent.config = markRaw(pageContext.config);

      await nextTick();
      returned = true;
      if (err) {
        throw err;
      }
    },
  });

  // Make `pageContext` accessible from any Vue component
  setPageContext(app, pageContextReactive);

  return app;
}
