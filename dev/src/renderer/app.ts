import { createApp as createSPAApp, createSSRApp, defineComponent, h, markRaw, nextTick, reactive, ref } from 'vue';
import type { PageContext } from 'vike/types';
import { setPageContext } from '$dev/renderer/usePageContext';
import objectAssign from '$dev/utils/objectAssign';

import '$lib/style/tokens/typography.sass';
import '$lib/style/tokens/colors.sass';
import '$lib/style/base/index.sass';
import '$lib/style/themes/index.sass';

import '$dev/assets/styles/index.sass';

export function createApp(
  pageContext: PageContext,
  ssrApp: boolean = false,
  renderHead: boolean = false,
) {
  const { Page } = pageContext;
  const Head = renderHead ? pageContext.config.Head : undefined;

  const pageRef = ref(markRaw(Head || Page));
  const pagePropsRef = ref(markRaw(pageContext.pageProps || {}));
  const configRef = ref(markRaw(pageContext.config));

  const PageWithLayout = defineComponent({
    render() {
      if (configRef.value.Layout && !renderHead) {
        return h(
          configRef.value.Layout,
          {},
          {
            default: () => pageRef.value === null ? null : h(pageRef.value, pagePropsRef.value),
          },
        );
      }

      return pageRef.value === null ? null : h(pageRef.value, pagePropsRef.value);
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
      pageRef.value = markRaw(pageContext.Page);
      pagePropsRef.value = markRaw(pageContext.pageProps || {});
      configRef.value = markRaw(pageContext.config);

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
