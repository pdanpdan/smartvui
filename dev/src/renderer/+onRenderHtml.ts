import { renderToNodeStream, renderToString } from '@vue/server-renderer';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import type { App } from 'vue';
import { createApp } from '$dev/renderer/app';
import { getPageTitle } from '$dev/renderer/getPageMeta';

export const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { stream } = pageContext.config;
  let pageView: ReturnType<typeof dangerouslySkipEscape> | ReturnType<typeof renderToNodeStream> | string = '';

  if (pageContext.Page !== undefined) {
    // SSR is enabled
    const app = createApp(pageContext);
    if (pageContext.config.vuePlugins) {
      pageContext.config.vuePlugins.forEach(({ plugin, options }) => {
        app.use(plugin, options);
      });
    }
    pageView = stream === true
      ? renderToNodeStreamWithErrorHandling(app)
      : dangerouslySkipEscape(await renderToStringWithErrorHandling(app));
  }

  const lang = pageContext.config.lang || 'en';
  const faviconTag = !pageContext.config.favicon ? '' : escapeInject`<link rel="icon" href="${ pageContext.config.favicon }" />`;
  const title = getPageTitle(pageContext);
  const titleTag = !title ? '' : escapeInject`<title>${ title }</title>`;
  const descriptionTag = !pageContext.config.description ? '' : escapeInject`<meta name="description" content="${ pageContext.config.description }" />`;

  let headHtml: ReturnType<typeof dangerouslySkipEscape> | string = '';
  if (pageContext.config.Head !== undefined) {
    const app = createApp(pageContext, /* ssrApp */ true, /* renderHead */ true);
    headHtml = dangerouslySkipEscape(await renderToStringWithErrorHandling(app));
  }

  const documentHtml = escapeInject`<!DOCTYPE html>
<html lang="${ lang }" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    ${ faviconTag }
    ${ titleTag }
    ${ descriptionTag }
    ${ headHtml }
  </head>
  <body>
    <div id="app">${ pageView }</div>
  </body>
</html>`;

  return {
    documentHtml,
    pageContext: {
      // https://vike.dev/stream
      enableEagerStreaming: true,
    },
  };
};

async function renderToStringWithErrorHandling(app: App) {
  let returned = false;
  let err: unknown;
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    if (returned) {
      console.error(err_);
    } else {
      err = err_;
    }
  };
  const appHtml = await renderToString(app);
  returned = true;
  if (err) {
    throw err;
  };
  return appHtml;
}

function renderToNodeStreamWithErrorHandling(app: App) {
  let returned = false;
  let err: unknown;
  app.config.errorHandler = (err_) => {
    if (returned) {
      console.error(err_);
    } else {
      err = err_;
    }
  };
  const appHtml = renderToNodeStream(app);
  returned = true;
  if (err) {
    throw err;
  };
  return appHtml;
}
