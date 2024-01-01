// https://vike.dev/onBeforeRender

import type { OnBeforeRenderAsync } from 'vike/types';

export const onBeforeRender: OnBeforeRenderAsync = async (pageContext): ReturnType<OnBeforeRenderAsync> => {
  const { name } = pageContext.routeParams;
  const pageProps = { name };
  return {
    pageContext: {
      pageProps,
    },
  };
};
