/// <reference lib="webworker" />
import { renderPage } from 'vike/server';
// TODO: stop using universal-middleware and directly integrate server middlewares instead.
// Bati generates boilerplates that use universal - middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier.
// This is temporary and will be removed soon.
import type { Get, UniversalHandler } from '@universal-middleware/core';

export const vikeHandler: Get<[], UniversalHandler> = () => async (request, context, runtime) => {
  const prefersColorScheme = request.headers.get('sec-ch-prefers-color-scheme');

  const pageContextInit = {
    ...context,
    ...runtime,
    urlOriginal: request.url,
    headersOriginal: request.headers,

    prefersDark: [ 'dark', 'light' ].includes(String(prefersColorScheme)) ? prefersColorScheme === 'dark' : null,
    prefersLang: request.headers.get('accept-language') || null,
    viewport: {
      width: Number.parseInt(String(request.headers.get('sec-ch-viewport-width')), 10) || Number.parseInt(String(request.headers.get('viewport-width')), 10) || null,
      height: Number.parseInt(String(request.headers.get('sec-ch-viewport-height')), 10) || Number.parseInt(String(request.headers.get('viewport-height')), 10) || null,
    },
    forceUserAgent: request.headers.get('user-agent') || null,
  };
  const pageContext = await renderPage(pageContextInit);
  const response = pageContext.httpResponse;

  response.headers.push([ 'Accept-Ch', 'Sec-Ch-Prefers-Color-Scheme, Sec-CH-Viewport-Width, Viewport-Width, Sec-CH-Viewport-Height, Viewport-Height' ]);
  response.headers.push([ 'Critical-Ch', 'Sec-Ch-Prefers-Color-Scheme, Sec-CH-Viewport-Width, Viewport-Width, Sec-CH-Viewport-Height, Viewport-Height' ]);
  response.headers.push([ 'Vary', 'Sec-Ch-Prefers-Color-Scheme, Sec-CH-Viewport-Width, Viewport-Width, Sec-CH-Viewport-Height, Viewport-Height' ]);

  const { readable, writable } = new TransformStream();
  response.pipe(writable);

  return new Response(readable, {
    status: response.statusCode,
    headers: response.headers,
  });
};
