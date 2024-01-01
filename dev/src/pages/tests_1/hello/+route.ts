// https://vike.dev/route

import type { RouteSync } from 'vike/types';
import { resolveRoute } from 'vike/routing';
import { render } from 'vike/abort';
import { names } from './names';

// We use a Route Function to implement advanced routing logic
export const route: RouteSync = (pageContext) => {
  if (pageContext.urlPathname === '/tests_1/hello' || pageContext.urlPathname === '/tests_1/hello/') {
    const name = 'anonymous';
    return { routeParams: { name } };
  }
  const result = resolveRoute('/tests_1/hello/@name', pageContext.urlPathname);
  if (!result.match) {
    return false;
  }
  const { name } = result.routeParams;
  if (!names.includes(name)) {
    throw render(404, `Unknown name: ${ name }.`);
  }
  return { routeParams: { name } };
};
