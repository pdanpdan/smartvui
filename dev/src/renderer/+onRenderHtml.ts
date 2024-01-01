import { renderToNodeStream, renderToString } from '@vue/server-renderer';
import { dangerouslySkipEscape, escapeInject } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import { createApp } from '$dev/renderer/app';
import { getPageTitle } from '$dev/renderer/getPageMeta';

export const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  let pageStream: string | ReturnType<typeof renderToNodeStream> = '';

  if (pageContext.Page !== undefined) {
    // SSR is enabled
    const app = createApp(pageContext);
    if (pageContext.config.vuePlugins) {
      pageContext.config.vuePlugins.forEach(({ plugin, options }) => {
        app.use(plugin, options);
      });
    }
    pageStream = renderToNodeStream(app);
  }

  const lang = pageContext.config.lang || 'en';
  const faviconTag = !pageContext.config.favicon ? '' : escapeInject`<link rel="icon" href="${ pageContext.config.favicon }" />`;
  const title = getPageTitle(pageContext);
  const titleTag = !title ? '' : escapeInject`<title>${ title }</title>`;
  const descriptionTag = !pageContext.config.description ? '' : escapeInject`<meta name="description" content="${ pageContext.config.description }" />`;

  let headHtml = '';
  if (pageContext.config.Head !== undefined) {
    const app = createApp(pageContext, /* ssrApp */ true, /* renderHead */ true);
    headHtml = await renderToString(app);
  }

  const documentHtml = escapeInject`<!DOCTYPE html>
<html lang='${ lang }' dir="ltr">
  <head>
    <meta charset="UTF-8" />
    ${ faviconTag }
    ${ titleTag }
    ${ descriptionTag }
    ${ dangerouslySkipEscape(headHtml) }
  </head>
  <body>
    <div id="app">${ pageStream }</div>
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
