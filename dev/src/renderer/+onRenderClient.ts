import type { OnRenderClientAsync } from 'vike/types';
import { createApp } from '$dev/renderer/app';
import { getPageTitle } from '$dev/renderer/getPageMeta';

let app: ReturnType<typeof createApp>;
export const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  if (!app) {
    // First rendering/hydration
    let container = document.getElementById('app');

    if (!container) {
      container = document.createElement('div');
      container.id = 'app';
      document.body.appendChild(container);
    }

    const ssr = container.innerHTML !== '';
    app = createApp(pageContext, ssr);

    if (pageContext.config.vuePlugins) {
      pageContext.config.vuePlugins.forEach(({ plugin, options }) => {
        app.use(plugin, options);
      });
    }

    app.mount(container);
  } else {
    // Client routing
    // See https://vike.dev/server-routing-vs-client-routing
    app.changePage(pageContext);
    // Get the page's `title` config value, which may be different from the
    // previous page. It can even be null, in which case we should unset the
    // document title.
    document.title = getPageTitle(pageContext) || '';
  }
};
